import { Request, Response } from 'express';
import { MapPolygon, CondoMaster, SalesHistoriesYearly, SalesHistoriesCondo, SalesHistoriesAvgPsf } from '../schema';
import { asyncMiddleware } from '../util/asyncMiddleware';

import { logger } from '../util/log';
/**
 * GET /
 * Home page.
 */
export let index = asyncMiddleware(async (req: Request, res: Response) => {

  // const mapPolygon = await MapPolygon.findOne({ 'cluster_id': req.param('id') }).exec();

  // const condos = await CondoMaster.find({ geometry: { $geoWithin: { $geometry: mapPolygon.toObject().geometry } } })
  //   .then(doc => {
  //     res.json(doc);
  //   });

  if (req.session.token) {
    res.cookie('token', req.session.token);
    res.json({
      status: 'session cookie set',
      user: req.user
    });
  } else {
    res.cookie('token', '');
    res.json({
      status: 'session cookie not set'
    });
  }

});

export let region = asyncMiddleware(async (req: Request, res: Response) => {

  const mapPolygon = await MapPolygon.findOne({ 'type': req.query.type, 'cluster_id': req.query.id }).exec();

  const condoMaster = await CondoMaster.find({ 'area': req.query.id }).exec();

  const response = { region: mapPolygon.toObject(), condoMasters: condoMaster.map(d => d.toObject()) };

  res.json(response);

});


export let dropdowns = asyncMiddleware(async (req: Request, res: Response) => {

  console.log('x'+req.cookies.jwt);
  const mapPolygon = await MapPolygon.find({}, ['id', 'name', 'type'], {
    sort: {
      type: 1,
      name: 1
    }
  });

  res.json(mapPolygon);


});


export let summary = asyncMiddleware(async (req: Request, res: Response) => {
  const filters = summaryFilter({});
  const result = await SalesHistoriesCondo.aggregate(filters).exec();
  res.json(result[0]);


});



export let summary_area = asyncMiddleware(async (req: Request, res: Response) => {

  const filters = summaryFilter({ '_id.area': req.query.id });
  const result = await SalesHistoriesCondo.aggregate(filters).exec();
  res.json(result[0]);

});

export let condo_info = asyncMiddleware(async (req: Request, res: Response) => {

  const condoMaster = await CondoMaster.findOne({ 'geometry.coordinates': [req.query.lng, req.query.lat] }).exec();

  const filters = summaryFilter({ '_id.condo_id': condoMaster.toObject().id });

  const salesHistories = await SalesHistoriesCondo.aggregate(filters).exec();

  const response = { condoMaster: condoMaster.toObject(), psfSummary: salesHistories[0] };

  res.json(response);

});

export let condo_list = asyncMiddleware(async (req: Request, res: Response) => {


  const response = await SalesHistoriesCondo.aggregate([
    {
      $lookup:
      {
        from: 'condomasters',
        localField: '_id.condo_id',
        foreignField: 'id',
        as: 'con'
      }
    },
    {
      $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$con', 0] }, '$$ROOT'] } }
    },
    {
      $match: { area: req.query.id }
    }
    ,
    {
      $group: {
        _id: {
          id: '$id',
          name: '$name',
          tenure: '$tenure',
          completed_in: '$completed_in',
          number_of_unit: '$number_of_unit',
        },
        totalPsfPrice: { $sum: '$totalPsfPrice' },
        totalCount: { $sum: '$transactionCount' },
        total5yrPsfPrice: {
          $sum: {
            $cond: [
              { $eq: ['$last5yr', true] },
              '$totalPsfPrice',
              0
            ]
          }
        },
        total5yrCount: {
          $sum: {
            $cond: [
              { $eq: ['$last5yr', true] },
              '$transactionCount',
              0
            ]
          }
        },
        currentYrPsfPrice: {
          $sum: {
            $cond: [
              { $eq: ['$currentYr', true] },
              '$totalPsfPrice',
              0
            ]
          }
        },
        currentYrCount: {
          $sum: {
            $cond: [
              { $eq: ['$currentYr', true] },
              '$transactionCount',
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        allAvgPsf: { $divide: ['$totalPsfPrice', '$totalCount'] },
        last5YrAvgPsf: {
          $cond: [
            { $eq: ['$total5yrCount', 0] },
            0,
            { $divide: ['$total5yrPsfPrice', '$total5yrCount'] }
          ]
        },
        currentYrAvgPsf: {
          $cond: [
            { $eq: ['$currentYrCount', 0] },
            0,
            { $divide: ['$currentYrPsfPrice', '$currentYrCount'] }
          ]
        }
      }
    },
    {
      $project: {
        _id: 0,
        condoMaster: '$_id',
        psfSummary: {
          allAvgPsf: '$allAvgPsf',
          last5YrAvgPsf: '$last5YrAvgPsf',
          currentYrAvgPsf: '$currentYrAvgPsf'
        }
      }
    }
  ]).exec();

  res.json(response);

});

function summaryFilter(filter: { '_id.condo_id'?: string, '_id.area'?: string }) {
  return [
    {
      $match: filter
    },
    {
      $facet: {
        'all': [
          {
            $group: {
              _id: 0,
              totalPsfPrice: { $sum: '$totalPsfPrice' },
              totalCount: { $sum: '$transactionCount' }
            }
          },
          {
            $project: {
              _id: 0,
              allAvgPsf: { $divide: ['$totalPsfPrice', '$totalCount'] }
            }
          }
        ],
        'last5yr': [
          {
            $match: { 'last5yr': true }
          },
          {
            $group: {
              _id: 0,
              totalPsfPrice: { $sum: '$totalPsfPrice' },
              totalCount: { $sum: '$transactionCount' }
            }

          },
          {
            $project: {
              _id: 0,
              last5yrAvgPsf: { $divide: ['$totalPsfPrice', '$totalCount'] }
            }
          }
        ],
        'currentYr': [
          {
            $match: { 'currentYr': true }
          },
          {
            $group: {
              _id: 0,
              totalPsfPrice: { $sum: '$totalPsfPrice' },
              totalCount: { $sum: '$transactionCount' }
            }

          },
          {
            $project: {
              _id: 0,
              currentYrAvgPsf: { $divide: ['$totalPsfPrice', '$totalCount'] }
            }
          }
        ]
      }
    },
    {
      $project: {
        allAvgPsf: { $arrayElemAt: ['$all.allAvgPsf', 0] },
        last5yrAvgPsf: { $arrayElemAt: ['$last5yr.last5yrAvgPsf', 0] },
        currentYrAvgPsf: { $arrayElemAt: ['$currentYr.currentYrAvgPsf', 0] }
      }
    }
  ];
}

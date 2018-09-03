import './db';
import { text } from 'body-parser';
import { CondoMasterModel, MapPolygonModel } from './model';
import { MapPolygon, CondoMaster, SalesHistoriesYearly } from './schema';
import * as geox from 'geolib';
import * as _ from 'lodash';
(async () => {


  let result = await SalesHistoriesYearly.aggregate([
    {
      $facet: {
        'all': [
          {
            $group: {
              _id: 0,
              avgPsf: { $avg: '$avePrice' }
            }
          },
          {
            $project: {
              _id: 0,
              avgPsf: 1
            }
          }
        ],
        'last5yr': [
          {
            $match: { _id: { $gte: 2013 } }
          },
          {
            $group: {
              _id: 0,
              avgPsf: { $avg: '$avePrice' }
            }

          },
          {
            $project: {
              _id: 0,
              avgPsf: 1
            }
          }
        ],
        'currentYr': [
          {
            $match: { _id: { $eq: 2018 } }
          },
          {
            $group: {
              _id: 0,
              avgPsf: { $avg: '$avePrice' }
            }

          },
          {
            $project: {
              _id: 0,
              avgPsf: 1
            }
          }
        ]
      }
    },
    {
      $project: {
        allAvgPsf: { $arrayElemAt: ['$all.avgPsf', 0] },
        last5yrAvgPsf: { $arrayElemAt: ['$last5yr.avgPsf', 0] },
        currentYrAvgPsf: { $arrayElemAt: ['$currentYr.avgPsf', 0] }
      }
    }
  ]).exec();

  console.log(JSON.stringify(result));
  //     const mapPolygon = await MapPolygon.findOne({'cluster_id': 'zomarine_parade'}).exec();

  //     let obj = mapPolygon.toObject(); 
  //     let x = obj.geometry.coordinates[0].map(x => {return  {'longitude':x[0], 'latitude':x[1]}} );
  //     console.log(x);
  // //    obj.coordinates = obj.coordinates[0];
  //     console.log(JSON.stringify(obj));
  //     //const condos = await CondoMaster.find({ geometry: { $geoWithin: { $geometry: mapPolygon.toObject().geometry} } }).exec();

  //     const condos = await CondoMaster.find().exec();

  //     condos.forEach(doc => {
  //         const geo = doc.get('geometry');
  //         if(geo) {
  //             const point = {'longitude': geo.coordinates[0], 'latitude': geo.coordinates[1]};
  //             const isInside = geox.isPointInside(point, x);

  //             if(isInside) {
  //                 console.log(doc.get('name'));
  //             }
  //         }
  //     });


  const coord = [];

  const x = [[1, 2], [3, 4], [2, 1], [1, 2]];
  const y = [[2, 2], [4, 4]];


  // coord.push(x.map(xx => [xx[1],xx[0]]));
  // coord.push(y);


  console.log(JSON.stringify(_.uniqWith(x, _.isEqual)));
  // condos.forEach( c => {
  //     console.log(c.get('name') +' '+c.get('completed_in'));
  // })
})(); 
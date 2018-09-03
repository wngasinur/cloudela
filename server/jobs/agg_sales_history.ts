// import request from 'request-promise';
// import { MongoClient } from 'mongodb';
import axios from 'axios';
import '../db';
import moment = require('moment');
import { logger } from '../util/log';
import { map } from 'async';
import { ObjectId, ObjectID } from 'bson';
import mongoose = require('mongoose');
import { SalesHistory, SalesHistoriesCondo, SalesHistoriesAvgPsf } from '../schema';
import { SalesHistoryAvgPsfModel } from '../model';

// let districts = ['dtdistrict13', 'dtdistrict14', 'dtdistrict15', 'dtdistrict16', 'dtdistrict17', 'dtdistrict18', 'dtdistrict19', 'dtdistrict20', 'dtdistrict21', 'dtdistrict22', 'dtdistrict23', 'dtdistrict24', 'dtdistrict25', 'dtdistrict26', 'dtdistrict27', 'dtdistrict28'];
export async function aggSalesHistory() {
    logger.info('Starting sales history agg');

    await SalesHistory.aggregate([
        {
            $lookup:
            {
                from: 'condomasters',
                localField: 'condo_id',
                foreignField: 'id',
                as: 'con'
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$con', 0] }, '$$ROOT'] } }
        },
        {
            $group: {
                _id: { month: { $month: '$sales_date' }, year: { $year: '$sales_date' }, condo_id: '$condo_id', area: '$area' },
                totalPrice: { $sum: '$price_unit' },
                maxPrice: { $max: '$price_unit' },
                minPrice: { $min: '$price_unit' },
                totalPsfPrice: { $sum: '$price_psf' },
                avgPsfPrice: { $avg: '$price_psf' },
                transactionCount: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 1,
                totalPrice: 1,
                totalPsfPrice: 1,
                maxPrice: 1,
                minPrice: 1,
                avgPsfPrice: 1,
                transactionCount: 1,
                currentYr: { $eq: ['$_id.year', { $year: new Date() }] },
                last5yr: { $gte: ['$_id.year', { $subtract: [{ $year: new Date() }, 5] }] }
            }
        }
        ,
        {
            $out: 'saleshistories_condo'
        }
    ]).exec();

    // await SalesHistory.aggregate([
    //     {
    //        $group : {
    //         _id : { $year: '$sales_date' },
    //         totalPrice: { $sum: '$price_unit' },
    //         maxPrice: { $max: '$price_unit' },
    //         minPrice: { $min: '$price_unit' },
    //         totalPsfPrice: { $sum: '$price_psf' },
    //         avgPsfPrice: { $avg: '$price_psf' },
    //         transactionCount: { $sum: 1 }
    //        }
    //     },
    //     {
    //        $out: 'saleshistories_yearly'
    //     }
    // ]).exec();


    // const salesHistoryAvgPsf: Array<SalesHistoryAvgPsfModel.RootObject> = await SalesHistoriesCondo.aggregate([
    //     {
    //         $lookup:
    //         {
    //           from: 'condomasters',
    //           localField: '_id.condo_id',
    //           foreignField: 'id',
    //           as: 'con'
    //         }
    //       },
    //       {
    //           $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$con', 0 ] }, '$$ROOT' ] } }
    //        },
    //        {
    //           $facet: {
    //             'all': [
    //               {
    //                 $group: {
    //                   _id: '$id',
    //                   totalPsfPrice: { $sum: '$totalPsfPrice' },
    //                   totalCount: { $sum: '$transactionCount' }
    //                 }
    //               },
    //               {
    //                 $project: {
    //                   _id: 1,
    //                   allAvgPsf: { $divide: ['$totalPsfPrice', '$totalCount'] }
    //                 }
    //               }
    //             ],
    //             'last5yr': [
    //               {
    //                 $match: { 'last5yr': true }
    //               },
    //               {
    //                 $group: {
    //                   _id: '$id',
    //                   totalPsfPrice: { $sum: '$totalPsfPrice' },
    //                   totalCount: { $sum: '$transactionCount' }
    //                 }
    //               },
    //               {
    //                 $project: {
    //                   _id: 1,
    //                   last5yrAvgPsf:  { $divide: ['$totalPsfPrice', '$totalCount'] }
    //                 }
    //               }
    //             ],
    //             'currentYr': [
    //               {
    //                 $match: { 'currentYr': true }
    //               },
    //               {
    //                 $group: {
    //                   _id: '$id',
    //                   totalPsfPrice: { $sum: '$totalPsfPrice' },
    //                   totalCount: { $sum: '$transactionCount' }
    //                 }
    //               },
    //               {
    //                 $project: {
    //                   _id: 1,
    //                   currentYrAvgPsf: { $divide: ['$totalPsfPrice', '$totalCount'] }
    //                 }
    //               }
    //             ]
    //           }
    //         },
    //         {
    //           $project: {
    //             all: '$all',
    //             last5yr: '$last5yr',
    //             currentYr: '$currentYr'
    //           }
    //         }
    //   ]).exec();

    //   const allArr = salesHistoryAvgPsf[0].all;
    //   allArr.forEach(async arr => {
    //     await SalesHistoriesAvgPsf.findOneAndUpdate( {_id :  arr._id}, arr, {upsert: true, new: true, setDefaultsOnInsert: true }).exec();
    //   });
    //   const last5yrArr = salesHistoryAvgPsf[0].last5yr;
    //   last5yrArr.forEach(async arr => {
    //     await SalesHistoriesAvgPsf.findOneAndUpdate( {_id :  arr._id}, arr, {upsert: true, new: true, setDefaultsOnInsert: true }).exec();
    //   });
    //   const currentYrArr = salesHistoryAvgPsf[0].currentYr;
    //   currentYrArr.forEach(async arr => {
    //     await SalesHistoriesAvgPsf.findOneAndUpdate( {_id :  arr._id}, arr, {upsert: true, new: true, setDefaultsOnInsert: true }).exec();
    //   });

    logger.info('Finished sales history agg');

}
// (async () => {
//     await aggSalesHistory();
// })();






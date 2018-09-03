// import request from 'request-promise';
// import { MongoClient } from 'mongodb';
import axios from 'axios';
import qs = require('querystring');
import polyline = require('@mapbox/polyline');
import { MapPolygonModel } from '../model';
import { MapPolygon } from '../schema';
import '../db';
import moment = require('moment');
import { logger } from '../util/log';
import * as _ from 'lodash';

async function extractMapPolygons(ids: string, type: string): Promise<MapPolygonModel.RootObject> {
    const url = 'https://www.99.co/-/v3/polygons?ids=' + ids + '&type=' + type;
    const response: MapPolygonModel.RootObject = await axios.get(url).then( resp => {
        return resp.data as MapPolygonModel.RootObject;
    }).catch( error => {
        logger.error('exception while extract price ', error.response);
        return undefined;
    });
    return response;
    // console.log(responsex.data.count.total);
}
// let districts = ['dtdistrict13', 'dtdistrict14', 'dtdistrict15', 'dtdistrict16', 'dtdistrict17', 'dtdistrict18', 'dtdistrict19', 'dtdistrict20', 'dtdistrict21', 'dtdistrict22', 'dtdistrict23', 'dtdistrict24', 'dtdistrict25', 'dtdistrict26', 'dtdistrict27', 'dtdistrict28'];
export async function syncMapPolygons() {


        const mapParams: Map<String, String> = new Map();

        mapParams.set('zone', 'zobukit_batok,zosungei_kadut,zoclementi,zooutram,zopioneer,zoseletar,zowoodlands,zojurong_east,zoriver_valley,zomuseum,zomandai,zobedok,zosouthern_islands,zonewton,zotuas,zosembawang,zomarine_parade,zochangi,zohougang,zoang_mo_kio,zobukit_timah,zosengkang,zokallang,zoqueenstown,zobukit_merah,zopunggol,zochoa_chu_kang,zocentral_water_catchment,zopasir_ris,zotoa_payoh,zoyishun,zogeylang,zodowntown_core,zoorchard,zotanglin,zojurong_west,zonovena,zotampines,zorochor,zosingapore_river,zobukit_panjang,zobishan,zoserangoon');
        mapParams.set('region', 'recentral_region,renorth-east_region,reeast_region,rewest_region,renorth_region');

        let saveCounter = 0;
        mapParams.forEach( async (value: string, type: string) => {
            const resp: MapPolygonModel.RootObject = await extractMapPolygons(value, type );

            const data: Map<string, any> = resp.data;
            // tslint:disable-next-line:forin
            for ( const f in data ) {
                const map: MapPolygonModel.Polygon = data[f];
                const geometry = {coordinates: [] , type: 'Polygon'};
                let tempGeometry = [];
                let maxLength = 0;
                map.encoded_polygons.forEach( polygon => {
                    const arrLatLnd = polyline.decode(polygon);
//                    arrLatLnd.map(arr => [arr[1], arr[0]]);
                    if (arrLatLnd.length > maxLength) {
                        tempGeometry = arrLatLnd.map(arr => [arr[1], arr[0]]);
                        maxLength = arrLatLnd.length;
                    }
                });

                // logger.info('comparison '+ tempGeometry.length+' '+_.uniqWith(tempGeometry, _.isEqual).length);
                tempGeometry = _.uniqWith(tempGeometry, _.isEqual);
                if (!_.isEqual(tempGeometry[0], tempGeometry[tempGeometry.length - 1])) {
                    tempGeometry.push(tempGeometry[0]);
                }
                geometry.coordinates.push(tempGeometry);
                const mapPolygon =  { ...map, type, geometry };
                saveCounter++;
                await MapPolygon.findOneAndUpdate({ id: mapPolygon.id }, mapPolygon, { upsert: true, new: true }, (err, doc, raw) => {
                    if (err)
                    logger.error('Error saving map polygon',  err);
                });
            }
        });

        logger.info('Save length' + saveCounter);
}
(async () => {
  await syncMapPolygons();
})();





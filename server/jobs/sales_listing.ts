// import request from 'request-promise';
// import { MongoClient } from 'mongodb';
import axios from 'axios';
import { SalesListingModel } from '../model';
import { SalesListing } from '../schema';
import './db';
import { logger } from '../util/log';

async function  extractPrice(page: number, district: string): Promise<SalesListingModel.Response> {
    const url = 'https://www.99.co/api/v2/web/search/listings';
    const properties = { main_category: 'condo', query_limit: 'radius', property_segments: 'residential',
    sort_order: 'asc', query_type: 'district', query_ids: district, page_size: '50', listing_type: 'sale', rental_type: 'unit',
page_num: page, sort_field: 'updated_at', show_future_mrts: 'true', ignore_listing_page_num: 1 };
const resp = await axios.get(url, {params: properties});
const response: SalesListingModel.Response = resp.data as SalesListingModel.Response;
    return response;
    // console.log(responsex.data.count.total);
}

const districts = ['dtdistrict01', 'dtdistrict02', 'dtdistrict03', 'dtdistrict04', 'dtdistrict05', 'dtdistrict06', 'dtdistrict07', 'dtdistrict08', 'dtdistrict09', 'dtdistrict10', 'dtdistrict11', 'dtdistrict12', 'dtdistrict13', 'dtdistrict14', 'dtdistrict15', 'dtdistrict16', 'dtdistrict17', 'dtdistrict18', 'dtdistrict19', 'dtdistrict20', 'dtdistrict21', 'dtdistrict22', 'dtdistrict23', 'dtdistrict24', 'dtdistrict25', 'dtdistrict26', 'dtdistrict27', 'dtdistrict28'];
// let districts = ['dtdistrict13', 'dtdistrict14', 'dtdistrict15', 'dtdistrict16', 'dtdistrict17', 'dtdistrict18', 'dtdistrict19', 'dtdistrict20', 'dtdistrict21', 'dtdistrict22', 'dtdistrict23', 'dtdistrict24', 'dtdistrict25', 'dtdistrict26', 'dtdistrict27', 'dtdistrict28'];

(async () => {
    logger.info('Started  sales listing job');
    for (const district of districts) {
        logger.info('Saving for ' + district);
        let page = 1;
        do {
            logger.info('Page ' + page);
            const resp: SalesListingModel.Response = await extractPrice(page, district);
            if (resp.data.sections.length === 0) {
                break;
            }
            const section: SalesListingModel.Section = resp.data.sections[0];
            section.listings.forEach(listing => {
                const t = new SalesListing(listing);
                t.save(error => {
                    if (error !== undefined) {
                        logger.error('Error' + error);
                    }
                });
            });
            page++;
        } while (true);
    }
    logger.info('Finished ' + new Date());
})();





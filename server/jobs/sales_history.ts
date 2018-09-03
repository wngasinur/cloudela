// import request from 'request-promise';
// import { MongoClient } from 'mongodb';
import axios from 'axios';
import qs = require('querystring');
import { SalesHistoryModel } from '../model';
import { CondoMaster, SalesHistory } from '../schema';
import '../db';
import moment = require('moment');
import { logger } from '../util/log';

async function extractPrice(page: number, condoId: string): Promise<SalesHistoryModel.RootObject> {
    const url = 'https://www.99.co/api/v1/web/clusters/' + condoId + '/transactions/table/history';
    const properties = { transaction_type: 'sale', page_size: '1000', page_num: page };
    const response: SalesHistoryModel.RootObject = await axios.get(url, { params: properties }).then( resp => {
        return resp.data as SalesHistoryModel.RootObject;
    }).catch( error => {
        logger.error('exception while extract price ', error.response);
        return undefined;
    });
    return response;
    // console.log(responsex.data.count.total);
}
// let districts = ['dtdistrict13', 'dtdistrict14', 'dtdistrict15', 'dtdistrict16', 'dtdistrict17', 'dtdistrict18', 'dtdistrict19', 'dtdistrict20', 'dtdistrict21', 'dtdistrict22', 'dtdistrict23', 'dtdistrict24', 'dtdistrict25', 'dtdistrict26', 'dtdistrict27', 'dtdistrict28'];
export async function syncSalesHistory() {

    const dateRegex: RegExp = /(\d{2})\/(\d{2})\/(\d{4})/mi;
    const sizeRegex: RegExp = /([\d\,]*) (sqm|sqft)/mi;
    const tmpPricePsfRegex: RegExp = /S\$(.*) psf/mi;
    const tmpPriceUnitRegex: RegExp = /S\$([0-9\.\,]*)M*$/mi;

    const condoMasters = await CondoMaster.find({}).exec();

    let savingLength = 0;
    for (const tmp of condoMasters) {
        const condoMaster = tmp.toObject();

        logger.info('Saving for ' + condoMaster.id + ' ' + condoMaster.name);
        if (!condoMaster.id) {
            logger.warn('Skip ' + condoMaster.name);
            continue;
        }
        let page = 1;
        do {
            logger.info('Page ' + page);
            const resp: SalesHistoryModel.RootObject = await extractPrice(page, condoMaster.id);
            if (!resp || resp.data.rows.length === 0) {
                break;
            }
            const data: SalesHistoryModel.Data = resp.data;

            let sales_date: Date;
            let block: string;
            let unit: string;
            let size_sqft: number;
            let size_sqm: number;
            let price_psf: number;
            let price_unit: number;

            for (const tmpSalesHistory of data.rows) {
                const tmpDate = tmpSalesHistory[0];
                if (dateRegex.test(tmpDate.title)) {
                    sales_date = moment(tmpDate.title, 'DD/MM/YYYY').toDate();
                }
                const tmpBlock = tmpSalesHistory[1];

                block = tmpBlock.title;
                const tmpUnit = tmpSalesHistory[2];
                unit = tmpUnit.title;

                const tmpSize = tmpSalesHistory[3];
                if (sizeRegex.test(tmpSize.subtitle)) {

                    const regexResult = sizeRegex.exec(tmpSize.subtitle);
                    if (regexResult) {

                        const tmpNum = parseFloat(regexResult[1].replace(/,/g, ''));
                        size_sqm = tmpNum;
                    }
                }


                if (sizeRegex.test(tmpSize.title)) {
                    const regexResult = sizeRegex.exec(tmpSize.title);
                    if (regexResult) {
                        const tmpNum = parseFloat(regexResult[1].replace(/,/g, ''));
                        size_sqft = tmpNum;
                    }
                }

                const tmpPrice = tmpSalesHistory[4];
                if (tmpPricePsfRegex.test(tmpPrice.subtitle)) {
                    const regexResult = tmpPricePsfRegex.exec(tmpPrice.subtitle);
                    if (regexResult) {
                        const tmpNum = parseFloat(regexResult[1].replace(/,/g, ''));
                        price_psf = tmpNum;
                    }
                }
                if (tmpPriceUnitRegex.test(tmpPrice.title)) {
                    const regexResult = tmpPriceUnitRegex.exec(tmpPrice.title);
                    if (regexResult) {
                        let tmpNum = parseFloat(regexResult[1].replace(/,/g, ''));
                        if (tmpPrice.title.includes('M'))
                            tmpNum *= 1000000;
                        price_unit = tmpNum;
                    }
                }

                // logger.info(sales_date + '|' + block + '|' + unit + '|' + size_sqft + '|' + size_sqm + '|' + price_psf + '|' + price_unit)

                const salesHistory = new SalesHistory({
                    condo_id: condoMaster.id,
                    sales_date: sales_date,
                    block: block,
                    unit: unit,
                    size_sqft: size_sqft,
                    size_sqm: size_sqm,
                    price_psf: price_psf,
                    price_unit: price_unit
                });
                // logger.info('Saving ', salesHistory.toObject());
                savingLength++;
                salesHistory.save();
            }

            page++;
        } while (true);
    }

    logger.info('Saving length ' + savingLength);
}
(async () => {
  await syncSalesHistory();
})();





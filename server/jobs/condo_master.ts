import * as puppeteer from 'puppeteer';
import { CondoMaster } from '../schema';
import '../db';
import { text } from 'body-parser';
import { CondoMasterModel, CondoSearch } from '../model';
import axios from 'axios';
import { logger } from '../util/log';

async function extractCondoInfo(keyword: string) {
  let retryable = false;
  let maxLength = 42;
  let returnedLocation: CondoSearch.Location;

  do {
    const url = 'https://www.99.co/api/v2/web/autocomplete/location?input=' + keyword.substring(0, maxLength) + '&property_segments=residential';
    returnedLocation = await axios.get(url).then(resp => {

      const response: CondoSearch.RootObject = resp.data as CondoSearch.RootObject;

      for (const section of response.data.sections) {
        if (section.title === 'Project') {
          for (const location of section.locations) {
            returnedLocation = location;
            break;
          }
        }
        if (returnedLocation)
          break;
      }
      retryable = false;

      return returnedLocation;
    }).catch(e => {
      if (e.response.status === 400) {
        if (e.response.data.error.type === 'input_error') {
          retryable = true;
          maxLength--;
        }

        logger.error('exception while fetch condo info ' + keyword.substring(0, maxLength), e.response.data);
      } else {
        logger.error('exception while fetch condo info ' + keyword.substring(0, maxLength), e.response);
        retryable = false;
      }

      return undefined;
    });

  } while (retryable);

  return returnedLocation;
}

export async function syncCondoMaster() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // await page.screenshot({path: 'example.png'});
  const alphaString = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let pageNo = 1;
  const alphaArr: string[] = alphaString.split('');
  let permArr: CondoMasterModel[] = [];

  for (const alpha of alphaArr) {
    logger.info('Alpha ' + alpha);
    pageNo = 1;
    do {
      const responseArr: CondoMasterModel[] = await page.goto('https://www.99.co/singapore/condos-apartments?page=' + pageNo + '&alphabet=' + alpha)
        .then(async resp => {
          const tempArr: CondoMasterModel[] = await page.evaluate(() => {
            const completedRegex: RegExp = /Completed.*<b>(.*)<\/b>/gmi;
            const numberOfUnitRegex: RegExp = /Number of units.*<b>(.*)<\/b>/gmi;
            const tenureRegex: RegExp = /Tenure.*<b>(.*)<\/b>/gmi;
            const developerRegex: RegExp = /Developer.*<b>(.*)<\/b>/gmi;

            const selectorx = '#content > div.container.directory-page > div:nth-child(3) > div.col-md-6.development-preview';
            const condoElements = Array.from(document.querySelectorAll(selectorx));
            const arrx: CondoMasterModel[] = [];
            if (condoElements.length !== 0) {
              Array.from(condoElements).forEach(condoElement => {
                const href = condoElement.querySelector('a').href;
                const condoName = condoElement.querySelector('h4').innerText;
                let developer, completedIn, numberUnit, tenure;

                Array.from(condoElement.querySelectorAll('.room-feature-key')).forEach(roomElement => {

                  const textStr = roomElement.innerHTML;
                  if (completedRegex.test(textStr)) {
                    const regexResult = /Completed.*<b>(.*)<\/b>/gmi.exec(textStr);
                    if (regexResult !== undefined && regexResult.length === 2) {
                      completedIn = regexResult[1];
                    }
                  } else if (developerRegex.test(textStr)) {
                    const regexResult = /Developer.*<b>(.*)<\/b>/gmi.exec(textStr);
                    if (regexResult !== undefined && regexResult.length === 2) {
                      developer = regexResult[1];
                    }
                  } else if (numberOfUnitRegex.test(textStr)) {
                    const regexResult = /Number of units.*<b>(.*)<\/b>/gmi.exec(textStr);
                    if (regexResult !== undefined && regexResult.length === 2) {
                      numberUnit = regexResult[1];
                    }
                  } else if (tenureRegex.test(textStr)) {
                    const regexResult = /Tenure.*<b>(.*)<\/b>/gmi.exec(textStr);
                    if (regexResult !== undefined && regexResult.length === 2) {
                      tenure = regexResult[1];
                    }
                  }
                });

                const condoMaster: Partial<CondoMasterModel> = { name: condoName, sync_url: href, developer: developer, tenure: tenure, completed_in: completedIn, number_of_unit: numberUnit };
                arrx.push(condoMaster as CondoMasterModel);
                // condoElement.querySelectorAll('.room-feature-key').forEach(roomElement => {
                //   console.log(roomElement.innerHTML);
                // });

              });
            }
            return arrx;
          });

          return tempArr;
        })
        .catch(e => {
          logger.error('Exception while fetch condo master pupetter ', e.response);
          return [];
        });

      if (!responseArr || responseArr.length === 0) {
        break;
      }

      permArr = permArr.concat(responseArr);

      for (const condo of responseArr) {
        const condoInfo: CondoSearch.Location = await extractCondoInfo(condo.name);
        if (condoInfo) {
          const updatedCondo = { ...condo, id: condoInfo.id, geometry: { type: 'Point' , coordinates: [condoInfo.coordinates.lng, condoInfo.coordinates.lat]} };
          // logger.info(updatedCondo);
          await CondoMaster.findOneAndUpdate({ name: condo.name }, updatedCondo, { upsert: true, new: true }, (err, doc, raw) => {
            if (err)
              logger.error('Error saving condo master' + err);
          });
        } else {
          logger.warn('Condo ' + condo.name + ' cant be identified');
        }

      }


      pageNo++;

    } while (true);
  }

  logger.info('Saving length ' + permArr.length);


  await browser.close();
}
// (async () => {
//   await extractCondoInfo('THE RESIDENCES AT W SINGAPORE SENTOSA COVE')
//   await syncCondoMaster();
// })();


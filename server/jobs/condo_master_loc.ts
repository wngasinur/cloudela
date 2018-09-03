import { MapPolygon, CondoMaster } from '../schema';
import '../db';
import { logger } from '../util/log';

// let districts = ['dtdistrict13', 'dtdistrict14', 'dtdistrict15', 'dtdistrict16', 'dtdistrict17', 'dtdistrict18', 'dtdistrict19', 'dtdistrict20', 'dtdistrict21', 'dtdistrict22', 'dtdistrict23', 'dtdistrict24', 'dtdistrict25', 'dtdistrict26', 'dtdistrict27', 'dtdistrict28'];
export async function syncCondoMasterLoc() {

    const mapPolygons = await MapPolygon.find().exec();



    mapPolygons.forEach(async mapPolygon => {

        logger.info('finding ' + mapPolygon.id);
        await CondoMaster.find({ geometry: { $geoWithin: { $geometry: mapPolygon.toObject().geometry} } })
        .then(condos => {
            condos.forEach(async condo => {
                CondoMaster.update({ _id: condo._id }, { $addToSet: { area : mapPolygon.id} }, function(err) {
                    if (err)
                        logger.error('error during update');
                });
            });
            logger.info('finished ' + mapPolygon.id);

        })
        .catch(err => {
            logger.error('error during find condo ' + mapPolygon.id, err);
        });
    });
}
(async () => {
  await syncCondoMasterLoc();
})();






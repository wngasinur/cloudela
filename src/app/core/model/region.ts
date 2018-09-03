import { Geometry, MultiPolygon } from 'geojson';

export interface Region {
    geometry: MultiPolygon;
    encoded_polygons: string[];
    created_date: Date;
    _id: string;
    id: string;
    __v: number;
    cluster_id: string;
    name: string;
    short_name: string;
    type: string;
}

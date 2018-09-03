
export namespace SalesListingModel {
    export interface Sections {
        rest: number;
    }
    export interface Count {
        matched_filters_and_search_bound: number;
        matched_filters: number;
        matched_filters_and_search_bound_and_low_priority: number;
        clusters_total: number;
        matched_filters_and_search_bound_and_high_priority: number;
        total: number;
        sections: Sections;
    }
    export interface Photo {
        url: string;
        caption?: any;
        id: string;
    }
    export interface User {
        phone: string;
        photo_url: string;
        id: string;
        name: string;
    }
    export interface TagAttributes {
    }
    export interface Flags {
        agent_99_only: boolean;
        user_seen: boolean;
        agent_is_premium: boolean;
        user_shortlisted: boolean;
        user_enquired: boolean;
    }
    export interface Location {
        district: string;
    }
    export interface ClusterMappings {
        development: string[];
        subzone: string[];
        zone: string[];
        district: string[];
        hdb_town: any[];
        region: string[];
        street: string[];
        address: string[];
        local: string[];
        street_name: string[];
    }
    export interface Attributes {
        area_size_formatted: string;
        bathrooms: number;
        area_ppsf_formatted: string;
        price_formatted: string;
        price: number;
        other_price: string;
        area_ppsf: number;
        area_size: number;
        completed_at: string;
        bedrooms: number;
        tenure?: any;
        bedrooms_formatted: string;
        bathrooms_formatted: string;
    }
    export interface Listing {
        status: string;
        property_segment: string;
        sub_category: string;
        shortlisted_state: boolean;
        tags: any[];
        listing_url: string;
        psf_subtext: string;
        overlays: any[];
        photos: Photo[];
        user: User;
        tag_attributes: TagAttributes;
        listing_type: string;
        id: string;
        sub_category_formatted: string;
        photo_url: string;
        distance?: any;
        date_formatted: string;
        main_category: string;
        highlights: string;
        commute_time: string;
        flags: Flags;
        location: Location;
        address_name: string;
        cluster_mappings: ClusterMappings;
        attributes: Attributes;
        address_line_2: string;
        address_line_1: string;
    }
    export interface Section {
        count: number;
        label: string;
        listings: Listing[];
        title: string;
    }
    export interface Data {
        count: Count;
        sections: Section[];
    }
    export interface Response {
        data: Data;
    }
    export interface RootObject {
        data: Data;
    }
}


export interface CondoMasterModel {
    id: string;
    name: string;
    sync_url?: string;
    developer?: string;
    tenure: string;
    completed_in: number;
    number_of_unit: number;
    created_date?: Date;
    sync_date?: Date;
}

export namespace CondoSearch {

    export interface Coordinates {
        lat: number;
        lng: number;
    }

    export interface Location {
        source: string;
        icon_key: string;
        subtitle: string;
        title: string;
        type: string;
        id: string;
        coordinates: Coordinates;
        main_categories: string[];
    }

    export interface Section {
        locations: Location[];
        title: string;
    }

    export interface Data {
        sections: Section[];
    }

    export interface RootObject {
        data: Data;
    }

}

export namespace SalesHistoryModel {

    export interface Header {
        subtitle?: any;
        title: string;
    }

    export interface Data {
        headers: Header[];
        rows: Header[][];
    }


    export interface RootObject {
        data: Data;
    }

}

export namespace MapPolygonModel {

    export interface Polygon {
        name: string;
        short_name: string;
        cluster_id: string;
        encoded_polygons: string[];
        id: string;
    }


    export interface RootObject {
        data: Map<string, Polygon>;
    }

}
export namespace SalesHistoryAvgPsfModel {

    export interface AvgPsf {
        _id: string;
        allAvgPsf?: number;
        last5yrAvgPsf?: number;
        currentYrAvgPsf?: number;

    }


    export interface CondoMasterSales {
        condoMaster: CondoMasterModel;
        psfSummary: AvgPsf;
    }


    export interface RootObject {
        all: AvgPsf[];
        last5yr: AvgPsf[];
        currentYr: AvgPsf[];
    }
}


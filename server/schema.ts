import mongoose = require('mongoose');

const salesListingSchema = new mongoose.Schema({
    id:    String,
    property_segment: String,
    sub_category: String,
    shortlisted_state: Boolean,
    tags: mongoose.Schema.Types.Mixed,
    listing_url: String,
    psf_subtext: String,
    overlays: mongoose.Schema.Types.Mixed,
    photos: mongoose.Schema.Types.Mixed,
    user: mongoose.Schema.Types.Mixed,
    tag_attributes: mongoose.Schema.Types.Mixed,
    listing_type: String,
    sub_category_formatted: String,
    photo_url: String,
    distance: mongoose.Schema.Types.Mixed,
    date_formatted: String,
    main_category: String,
    highlights: String,
    commute_time: String,
    flags: mongoose.Schema.Types.Mixed,
    location: mongoose.Schema.Types.Mixed,
    address_name: String,
    cluster_mappings: mongoose.Schema.Types.Mixed,
    attributes: mongoose.Schema.Types.Mixed,
    address_line_2: String,
    address_line_1: String
  });

const condoDirectorySchema = new mongoose.Schema({
    cluster_data: mongoose.Schema.Types.Mixed,
    nearby: mongoose.Schema.Types.Mixed,
    clusterId: String
});

const condoMasterSchema = new mongoose.Schema({
    id: String,
    name: {type: String, unique: true},
    sync_url: String,
    developer: String,
    tenure: String,
    completed_in : Number,
    number_of_unit : Number,
    created_date: {type: Date, default: Date.now},
    sync_date: {type: Date, default: undefined},
    geometry: { type: { type: String, default: 'Point'}, coordinates: [Number] },
    area: [String]
});

const salesHistorySchema = new mongoose.Schema({
    condo_id: String,
    sales_date: Date,
    block: String,
    unit: String,
    size_sqft: Number,
    size_sqm: Number,
    price_psf: Number,
    price_unit: Number,
    created_date: {type: Date, default: Date.now}
});


const salesHistoriesYearlySchema = new mongoose.Schema({
    _id: Number,
    totalPrice: Number,
    minPrice: Number,
    maxPrice: Number,
    totalPsfPrice: Number,
    avgPsfPrice: Number,
    transactionCount: Number,
    count: Number

});

const salesHistoriesCondoSchema = new mongoose.Schema({
    _id: { month: Number, year: Number, condo_id: String, area: [String]},
    totalPrice: Number,
    minPrice: Number,
    maxPrice: Number,
    totalPsfPrice: Number,
    avgPsfPrice: Number,
    transactionCount: Number,
    currentYr: Boolean,
    last5Yr: Boolean
});


const salesHistoriesAvgPsfSchema = new mongoose.Schema({
    _id: String,
    allAvgPsf: {type: Number, default: 0, required: true },
    last5yrAvgPsf: {type: Number, default: 0, required: true },
    currentYrAvgPsf: {type: Number, default: 0, required: true }
});

const mapPolygonSchema = new mongoose.Schema({
    name: String,
    short_name: String,
    cluster_id: String,
    encoded_polygons: [String],
    type: String,
    id: String,
    geometry: { type: { type: String, default: 'Polygon'}, coordinates: [[[Number]]] },
    created_date: {type: Date, default: Date.now}
});


const userSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    name: String,
    password: String,
    provider: String,
    providerData: mongoose.Schema.Types.Mixed,
    createdDate: { type: Date, default: Date.now },
    lastLoginDate: { type: Date, default: Date.now }
}, {
    _id: false
});

export const SalesListing = mongoose.model('SalesListing', salesListingSchema);

export const CondoMaster = mongoose.model('CondoMaster', condoMasterSchema);
export const CondoDirectory = mongoose.model('CondoDirectory', condoDirectorySchema);
export const SalesHistory = mongoose.model('SalesHistory', salesHistorySchema);
export const SalesHistoriesYearly = mongoose.model('saleshistories_yearly', salesHistoriesYearlySchema, 'saleshistories_yearly');
export const SalesHistoriesCondo = mongoose.model('saleshistories_condo', salesHistoriesCondoSchema, 'saleshistories_condo');
export const SalesHistoriesAvgPsf = mongoose.model('saleshistories_avg_psf', salesHistoriesAvgPsfSchema, 'saleshistories_avg_psf');

export const MapPolygon = mongoose.model('MapPolygon', mapPolygonSchema);
export const User = mongoose.model('User', userSchema);

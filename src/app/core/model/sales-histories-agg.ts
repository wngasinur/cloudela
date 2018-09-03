export interface SalesHistoryAgg {
    _id: { month: number, year: number, condo_id: String};
    totalPrice: number;
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
    count: number;
}

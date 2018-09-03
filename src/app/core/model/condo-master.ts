export interface CondoMaster {
    geometry?:        {type: string;
        coordinates?: number[]};
    area?:            string[];
    created_date?:    string;
    name:            string;
    completed_in?:   number;
    developer?:      string;
    id:              string;
    number_of_unit?: number;
    sync_url?:        string;
    tenure?:         string;
}

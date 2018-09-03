import axios from "axios";
import { AxiosInstance } from "axios";
import { ErrorHandler } from "@angular/core";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
 
// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //
 
export interface Params {
    [ key: string ]: any;
}
 
export interface GetOptions {
    url: string;
    params?: Params;
}
 
export interface ErrorResponse {
    id: string;
    code: string;
    message: string;
}
 
@Injectable({
    providedIn: "root"
})
export class ApiClient {
 
    private axiosClient: AxiosInstance;
    private errorHandler: ErrorHandler;
 
    // I initialize the ApiClient.
    constructor( errorHandler: ErrorHandler ) {
 
        this.errorHandler = errorHandler;
 
        // The ApiClient wraps calls to the underlying Axios client.
        this.axiosClient = axios.create({
            timeout: 3000,
            headers: {
                "Access-Control-Allow-Origin": "localhost"
            }
        });
 
    }
 
    // ---
    // PUBLIC METHODS.
    // ---
 
    // I perform a GET request with the given options.
    public async get<T>( options: GetOptions ) : Promise<T> {
 
        try {
 
            var axiosResponse = await this.axiosClient.request<T>({
                method: "get",
                url: options.url,
                params: options.params
            });
 
            return( axiosResponse.data );
 
        } catch ( error ) {
 
            return( Promise.reject( this.normalizeError( error ) ) );
 
        }
 
    }

    public getObservable<T>( options: GetOptions ): Observable<T> {

        const observable$ = Observable.create( ( observer ) => {
            this.axiosClient.request<T>({
                method: "get",
                url: options.url,
                params: options.params
            })
            .then( ( response ) => {
               //console.log('xxxx'+JSON.stringify(response.data));
                observer.next( response.data );
                observer.complete();
            } )
            .catch( ( error ) => {
                console.log('error');
                observer.error( error );
            } );
        } );

        return observable$;
    }
 
    // ---
    // PRIVATE METHODS.
    // ---
 
    // Errors can occur for a variety of reasons. I normalize the error response so that
    // the calling context can assume a standard error structure.
    private normalizeError( error: any ) : ErrorResponse {
 
        this.errorHandler.handleError( error );
 
        // NOTE: Since I'm not really dealing with a production API, this doesn't really
        // normalize anything (ie, this is not the focus of this demo).
        return({
            id: "-1",
            code: "UnknownError",
            message: "An unexpected error occurred."
        });
 
    }
 
}
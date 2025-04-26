import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user';
import { BROWSER_STORAGE } from '../storage';

import { Trip } from '../models/trip';
//import { ObjectExpression } from 'mongoose';


@Injectable({
  providedIn: 'root'
})
export class TripDataService {

  constructor(private http: HttpClient, @Inject (BROWSER_STORAGE) private storage: Storage) { }

  url = 'http://localhost:3000/api/trips';
  baseUrl = 'http://localhost:3000/api';


  getTrips() : Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url);
  }

  addTrip(formData: Trip) : Observable<Trip> {
    return this.http.post<Trip>(this.url, formData);
  }

  getTrip(tripCode: string) : Observable<Trip[]> {
    // console.log('Inside TripDataService::getTrips');
    return this.http.get<Trip[]>(this.url + '/' + tripCode);
  }

  updateTrip(formData: Trip) : Observable<Trip> {
    //console.log('Inside TripDataService::addTrips');
    return this.http.put<Trip>(this.url + '/' + formData.code, formData);
  }

  login(user: User, passwd: string) : Observable<AuthResponse> {
    //console.log('Inside TripDateService::login');
    return this.handleAuthAPICall('login', user, passwd);
  }

  register(user: User, passwd: string) : Observable<AuthResponse> {
    //console.log('Inside TripDataService::register');
    return this.handleAuthAPICall('register', user, passwd);
  }



  handleAuthAPICall(endpoint: string, user: User, passwd: string) : Observable<AuthResponse> {
    //console.log('Inside TripDataService::handleAuthAPICall');
    let fromData = {
      name: user.name,
      email: user.email,
      password: passwd
    };

    return this.http.post<AuthResponse>(
      `${this.baseUrl}/${endpoint}`,
      fromData);
  }
}

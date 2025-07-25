import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private apiKey="eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjA3NDU0N2M4YzViZjQ2ZGI4Y2RlMjJjODdiNDE4YjVkIiwiaCI6Im11cm11cjY0In0=";

  async getRoute(start: [number, number], end: [number, number]): Promise<[number, number][]> {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${this.apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;
    const response = await fetch(url);
    const data = await response.json();
    // Convert [lng, lat] to [lat, lng] for Leaflet
    return data.features[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
  }
}

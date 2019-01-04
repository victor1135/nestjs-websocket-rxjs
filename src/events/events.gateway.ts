import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable, interval, Subject, timer } from 'rxjs';
const { map, scan, tap, catchError, takeUntil, filter, repeat, mergeMap } = require('rxjs/operators');

@WebSocketGateway(8080)
export class EventsGateway {
  @WebSocketServer() server;
  destroy$: Subject<any> = new Subject<any>();
  cid = 0;
  uid = 0;

  @SubscribeMessage('events')
  onEvent(client, data): Observable<WsResponse<any>> {
    const clientId = this.cid++;
    console.log(`client ${clientId} CONNECTED`);
    const uid = this.uid++;
    console.log(`client ${clientId} CONNECTED`);
    return fakeData().pipe(
      map(({ x, y }) => ({ x, y, uid})),
      takeUntil(timer(3000))
    );
  }

  @SubscribeMessage('close-events')
  onCloseEvent(client, data): Observable<WsResponse<any>> {
    const { type, uid } = data;
    this.destroy$.next(data);
    return;
  }
}


const fakeData = () => interval(1000 / 60).pipe(
  scan(position => ({
    x: position.x + (Math.random() * 5) - 2.5,
    y: position.y + (Math.random() * 5) - 2.5,
  }), {
      x: Math.round(Math.random() * 180),
      y: Math.round(Math.random() * 450),
    })
);
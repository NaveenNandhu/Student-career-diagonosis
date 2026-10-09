from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from typing import List, Dict, Any
import asyncio
import json

router = APIRouter(tags=["Realtime Events"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                pass

manager = ConnectionManager()

@router.websocket("/ws/live-events")
async def websocket_live_events(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial handshake message
        await websocket.send_text(json.dumps({
            "type": "SYSTEM_CONNECTED",
            "status": "online",
            "message": "Real-time Intelligence Engine connected via WebSocket"
        }))
        while True:
            data = await websocket.receive_text()
            # Echo ping or handle client heartbeats
            if data == "ping":
                await websocket.send_text(json.dumps({"type": "pong", "timestamp": asyncio.get_event_loop().time()}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@router.post("/realtime/broadcast")
async def broadcast_event(event_data: Dict[str, Any]):
    """
    HTTP endpoint to trigger real-time notification push to all active frontend sessions.
    """
    await manager.broadcast(event_data)
    return {"status": "success", "active_clients": len(manager.active_connections), "event": event_data}

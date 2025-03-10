import asyncio
import websockets
import json
import sys
import time

sys.path.append('/home/pi/picar-x/picarx')

from picarx import picarx

car = picarx.Picarx()


async def handler(websocket, path):
    print("Client Connected")

    try:

        await websocket.send(json.dumps({"status": "connected"}))

        while True:


            message = await websocket.recv()
            print(f"Message recieved: {message}")
            command = json.loads(message)

            if command["action"] == "MOVE_FORWARD":
                print("moving forward")
                car.forward(50)
            elif command["action"]== "MOVE_BACKWARD":
                print("moving backward")
                car.backward(50)
            elif command["action"] == "TURN_LEFT":
                car.set_dir_servo_angle(-30)
                car.forward(50)
            elif command["action"] == "TURN_RIGHT":
                car.set_dir_servo_angle(30)
                car.forward(50)
            elif command["action"] == "STOP":
                print("stopping")
                car.stop()
            elif command["action"] == "GET_SERVER_DATA":
                print("getting sensor data")
                distance = round(car.ultrasonic.read(), 2)

                await websocket.send(json.dumps({"sensor_data": {"distance": distance}}))
            else:
                print("unknown command")

        await websocket.send(json.dumps({"status": "command executed"}))

    except Exception as e:
        print(f"Error occurred in handler: {e}")
    finally:
        print(f"closing connection from {websocket.remote_address}")
    await websocket.close()

async def main():
    try:
        server = await websockets.serve(handler, "192.168.4.186", 8765)
        await server.wait_closed()

    except Exception as e:
        print(f"error occurred while starting server: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"error occurred when running the event loop: {e}")

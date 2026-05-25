import socket
import threading
from protocol import Protocol


class Client:
    def __init__(self):
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.s.connect((Protocol.HOST, Protocol.PORT))
        print("Client connected")

        receive_thread = threading.Thread(target=self.receive_messages)
        receive_thread.daemon = True 
        receive_thread.start()

        print("Welcome to chess games chat! \n here you can chat with other users, view AVIALIABLE rooms and see the BOARD (NUMBER) state.")
        self.send_messages()
        
    def receive_messages(self):
        while True:
            data = self.s.recv(1024).decode()
            if not data:
                break
            
            print(f"Received from server:  \n {data}")
            
    def send_messages(self):
        while True:
            message = input()
            if message.strip():
                self.s.send(message.encode())
    
if __name__ == "__main__":
    Client()
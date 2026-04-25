import socket
from tcp_sockets.protocol import Protocol

class Server:

    def __init__(self):
        self.clients = []
    
    def start_server(self):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM)  as s:
            s.bind((Protocol.HOST, Protocol.PORT))
            s.listen()
            print(f"Server is up and running on port {Protocol.PORT}")
            conn, addr = s.accept()
            with conn:
                print(f"Connected on {addr}")
                while True:
                    data = conn.recv(1024)
                    if not data:
                        break
                    
                    self.send_message(addr,conn,data)
                    
    
    def send_message(self,addr,conn,data):
        for client in self.clients:
            if client != addr:
                conn.sendall(data)
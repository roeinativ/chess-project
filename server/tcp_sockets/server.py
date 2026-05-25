import socket
import threading
from tcp_sockets.protocol import Protocol

class Server:

    def __init__(self, game_manager):
        self.game_manager = game_manager
        self.clients = {}
    
    def start_server(self):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM)  as s:
            s.bind((Protocol.HOST, Protocol.PORT))
            s.listen()
            print(f"Server is up and running on port {Protocol.PORT}")
            while True:
                conn, addr = s.accept()
                print(f"Connected on {addr}")
                
                self.clients[addr] = conn
                
                client_thread = threading.Thread(target=self.handle_client, args=(conn, addr))
                client_thread.daemon = True  # Allows server to close cleanly when exiting
                client_thread.start()
                
                
    def handle_client(self, conn, addr):
        while conn:
            try: 
                while True:
                    data = conn.recv(1024).decode()
                    
                    if not data:
                        break
                    
                    parts = data.split()
                    command = parts[0]
                    
                    return_to_sender = None
                    new_data = data
                    
                    if command == "AVIALIABLE":
                        new_data = self.game_manager.avialiable_ids()
                        return_to_sender = True
                    
                    elif command == "BOARD":
                        new_data = self.game_manager.find_room_fen(parts[1]) 
                        return_to_sender = True
                    
                    elif not data:
                        break
                    
                    print(f"Recieved from {addr} : {data} ")
                    self.send_message(addr,new_data, return_to_sender)
                    
            except ConnectionResetError:
                pass
            
            finally:
                print(f"Disconnected {addr}")
                if addr in self.clients:
                    del self.clients[addr]
                    conn.close()
    
    def send_message(self,sender_addr,data,return_to_sender=None):
        print(f"Return to sender is {return_to_sender}")
        data_bytes = str(data).encode('utf-8')
        
        if return_to_sender:
            if sender_addr in self.clients:
                self.clients[sender_addr].send(data_bytes)
                print(f"Sent {sender_addr} : {data}")

        else:
            for addr, conn in self.clients.items():
                if addr != sender_addr:
                    conn.send(data_bytes)                    
                print(f"Sent {addr} : {data}")
               
    
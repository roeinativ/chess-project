import socket
from tcp_sockets.protocol import Protocol


class Client:

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((Protocol.HOST, Protocol.PORT))
        print("Client connected")
        data = s.recv(1024)

    print(f"Received {data}")

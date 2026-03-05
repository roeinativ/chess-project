from flask_socketio import emit, join_room, leave_room

class SocketEvents:
    def __init__(self,socketio, room_manager,board_manager):
        self.socketio = socketio
        self.room_manager = room_manager
        self.board_manager = board_manager
        self.home = room_manager.get_home()
        self.register()
        
    def register(self):
        
        @self.socketio.on("connect")
        def handle_connect():
            print("client connected")
            
        @self.socketio.on("join_home")
        def handle_join(data):
            self.home = self.room_manager.get_home()
            username = data.get("username")
            sid = data.get("sid")
            
            join_room(self.home)
            self.room_manager.add_to_home(sid)
            
            print(f"Home users: {self.room_manager.get_home_users()}")
            
            emit("join_home", {"username":username, "room":self.home}, to=sid)
            print(f"Sending to {sid} join home emit")
            
        @self.socketio.on("join_game")
        def handle_join_game(data):
            start_game = False
            
            username = data.get("username")
            room = data.get("room")
            sid = data.get("sid")
            
            leave_room(room)
            game_room = self.room_manager.find_room()
            if self.room_manager.add_to_game_room(sid):
                start_game = True
                
            join_room(game_room)
            
         
            
            emit("join_game", {"username":username, "room":game_room}, to=sid)
            print(f"{username} is being added to room {game_room}")
            print(f"Home users: {self.room_manager.get_home_users()}\n Game rooms: {self.room_manager.get_rooms()}")
            
            if start_game:
                sid_list = self.room_manager.get_room_sids(game_room)
                color_list = self.board_manager.get_colors()
                
                self.board_manager.create_new_board(game_room)
                
                def send_start():
                    self.socketio.sleep(0.3)  
                    self.socketio.emit("start_game", {"room": game_room, "color": color_list[0]}, to=sid_list[0])
                    self.socketio.emit("start_game", {"room": game_room, "color": color_list[1]}, to=sid_list[1])
        
                self.socketio.start_background_task(send_start)
                    
                print(f"Room number: {game_room}, start the game")
            
        @self.socketio.on("cancel_matchmaking")
        def handle_cancel_matchmaking(data):
            room = data.get("room")
            sid = data.get("sid")
            
            # Leave the current room
            self.room_manager.remove_from_room(sid)
            leave_room(room)
            
            self.home = self.room_manager.get_home()  
            
            # Join home
            self.room_manager.add_to_home(sid)
            join_room(self.home)
            
            emit("join_home", {"username": sid, "room": self.home}, to=sid)
            print(f"{sid} canceld matchmaking and is now joining home")
            print(f"Home users: {self.room_manager.get_home_users()}")
            
        
        # Get piece move from player
        
        @self.socketio.on("move")
        def handle_move(data):            
            sid = data.get("sid")
            color = data.get("color")
            room = data.get("room")
        
            square_from = data.get("from")
            square_to = data.get("to")
            
            move = square_from + square_to
                        
            # Checks if move is valid
            if self.board_manager.valid_move(move,room):
                
                # Push current game virtual server board and get fen
                self.board_manager.push_board(move,room)
                fen = self.board_manager.get_board_fen(room)
                
                
                # Check if checkmate or tie and change the winner
                if self.board_manager.is_checkmate(room):
                    winner = color
                
                elif self.board_manager.is_tie(room):
                    winner = "t"
                        
                else:
                    winner = None
                
                
                if winner:
                    emit("game_over", {"winner": winner, "fen": fen}, to=room)
                    print(f"Winner: {winner}, emiting to room {room}")
                    
                    # Put players inside the socket room home in order to clear it for other players
                    sid_list = self.room_manager.get_room_sids(room)
                    sid_list_copy = list(sid_list)
                    
                    for player_sid in sid_list_copy:
                        
                        self.room_manager.remove_from_room(player_sid)
                        leave_room(room,player_sid)
                        
                        self.room_manager.add_to_home(player_sid)
                        join_room(self.home,player_sid)
                    
                    print(f"Home users {self.room_manager.get_home_users()}")
                        
                
                
                else:
                    # If normal move emit to player:
                    
                    # Emit to current player
                    emit("is_move_valid", {"from": square_from, "to": square_to, "valid": True}, to=sid)
                    
                    # Emit to opponent
                    opponent_sid = self.room_manager.get_opponent_sid(room,sid)
                    emit("move", {"fen": fen}, to=opponent_sid)
                    print("Move valid sending to opponent")
                
            else:
                print("Move not valid")
            
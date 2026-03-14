from flask_socketio import emit, join_room, leave_room
from flask import request
from models.users import Users
from models.games import GameHistory

class SocketEvents:
    def __init__(self,socketio, room_manager, board_manager, signed_in_clients, stockfish):
        self.socketio = socketio
        self.room_manager = room_manager
        self.board_manager = board_manager
        self.signed_in_clients = signed_in_clients
        self.home = room_manager.get_home()
        self.stockfish = stockfish
        self.register()
        
    def register(self):
        
        @self.socketio.on("connect")
        def handle_connect():
            sid = request.sid                   
            print(f"client connected {sid}")
            
        @self.socketio.on("update_connection")
        def handle_update_connection(data):
            new_sid = request.sid
            username = data.get("username")
            
            self.signed_in_clients.update_user(username,new_sid)
            
            
        @self.socketio.on("sign_in")
        def handle_sign_in(data):
            username = data.get("username")
            sid = request.sid
            
            user = Users.query.filter_by(name=username).first()
            user_id = user.id
            
            self.signed_in_clients.add_user(sid,user_id)
            
        @self.socketio.on("sign_out")
        def handle_sign_out():
            sid = request.sid
            self.signed_in_clients.remove_user(sid)
        
        @self.socketio.on("disconnect")
        def handle_disconnect():
            sid = request.sid
            self.room_manager.remove_from_room(sid)
            self.room_manager.remove_from_home(sid)
            leave_room(sid)
            print("Removed client from current room")
            
            
        @self.socketio.on("join_home")
        def handle_join_home(data):
            self.home = self.room_manager.get_home()
            username = data.get("username")
            sid = request.sid
            
            join_room(self.home)
            self.room_manager.add_to_home(sid)
            
            print(f"Home users: {self.room_manager.get_home_users()}")
            
            emit("join_home", {"username":username, "room":self.home}, to=sid)
            print(f"Sending to {sid} join home emit")
                
            
        @self.socketio.on("join_game")
        def handle_join_game(data):
            start_game = False
            
            username = data.get("username")
            mode = data.get("mode")
            sid = request.sid
            
            game_room = self.room_manager.find_room(mode)
            if self.room_manager.add_to_game_room(sid,mode):
                start_game = True
                
            join_room(game_room)
            
         
            
            emit("join_game", {"username":username, "room":game_room}, to=sid)
            print(f"{username} is being added to room {game_room}")
            print(f"Home users: {self.room_manager.get_home_users()}\n Game rooms: {self.room_manager.get_rooms()}")
            
            if start_game:
                sid_list = self.room_manager.get_room_sids(game_room)
                number_of_players = len(sid_list)
                color_list = self.board_manager.get_colors()
                
                self.board_manager.create_new_board(game_room)
                
                def send_start():
                    self.socketio.sleep(0.3) 
                    for i in range(number_of_players): 
                        color = color_list[i]
                        self.socketio.emit("start_game", {"room": game_room, "color": color}, to=sid_list[i])
        
                self.socketio.start_background_task(send_start)
                
                print(f"Room number: {game_room}, start the game")
                
                # Tell stockfish bot to begin the game if he is white
                
                if mode == "PVE" and color_list[0] == 'black':
                    
                    fen = self.board_manager.get_board_fen(game_room)
                    engine_move = self.stockfish.get_best_move(fen)
                    self.board_manager.push_board(engine_move,game_room)
                    fen = self.board_manager.get_board_fen(game_room)
                    emit("move", {"fen": fen}, to=sid)
                    
                else:
                    game_history = GameHistory()
                    
            
        @self.socketio.on("cancel_matchmaking")
        def handle_cancel_matchmaking(data):
            room = data.get("room")
            sid = request.sid
            
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
            sid = request.sid
            color = data.get("color")
            room = data.get("room")
            mode = data.get("mode")
        
            square_from = data.get("from")
            square_to = data.get("to")
            promotion = data.get("promotion")
            print(f"Promotion is {promotion}")
            
            move = square_from + square_to
            
            if promotion:
                move = move + promotion
                print(f"New move is {move}")
                        
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
                    leave_game(room)            
                
                elif mode == 'PVP':
                    # If normal move emit to player:
                    
                    # Emit to current player
                    emit("is_move_valid", {"from": square_from, "to": square_to, "valid": True}, to=sid)
                    
                    # Emit to opponent
                    opponent_sid = self.room_manager.get_opponent_sid(room,sid)
                    emit("move", {"fen": fen}, to=opponent_sid)
                    print("Move valid sending to opponent")
                     
                else:                    
                    emit("is_move_valid", {"from": square_from, "to": square_to, "valid": True}, to=sid)
                    
                    engine_move = self.stockfish.get_best_move(fen)
                    self.board_manager.push_board(engine_move,room)
                    fen = self.board_manager.get_board_fen(room)
                    
                    emit("move", {"fen": fen}, to=sid)
                    
                    
                    # Checks if stockfish won
                    
                    if self.board_manager.is_checkmate(room):
                        emit("game_over", {"winner": "engine", "fen": fen}, to=sid)
                        leave_game(room)
                    
                    elif self.board_manager.is_tie(room):
                        emit("game_over", {"winner": "t", "fen": fen}, to=sid)
                        leave_game(room)
                    
                    
                    
                
            else:
                print("Move not valid")
        
        
        def leave_game(room):
            sid_list = self.room_manager.get_room_sids(room)
            sid_list_copy = list(sid_list)
            
            for player_sid in sid_list_copy:
                
                self.room_manager.remove_from_room(player_sid)
                leave_room(room,player_sid)
                
                self.room_manager.add_to_home(player_sid)
                join_room(self.home,player_sid)
            
            print(f"Home users {self.room_manager.get_home_users()}")
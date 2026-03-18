from flask import request
from flask_socketio import join_room, leave_room ,emit

class MatchmakingEvents():
    def __init__(self,starting_time, context,state, count_time):
        
        self.context = context
        self.starting_time = starting_time
        self.count_time = count_time
        self.home = self.context.room_manager.get_home()
        self.state = state
        self.matchmaking_events()

    
    def matchmaking_events(self):
    
        @self.context.socketio.on("join_home")
        def handle_join_home(data):
            self.home = self.context.room_manager.get_home()
            username = data.get("username")
            sid = request.sid

            join_room(self.home)
            self.context.room_manager.add_to_home(sid)

            print(f"Home users: {self.context.room_manager.get_home_users()}")

            emit("join_home", {"username": username, "room": self.home}, to=sid)
            print(f"Sending to {sid} join home emit")

        @self.context.socketio.on("join_game")
        def handle_join_game(data):
            start_game = False

            username = data.get("username")
            mode = data.get("mode")
            sid = request.sid

            game_room = self.context.room_manager.find_room(mode)
            if self.context.room_manager.add_to_game_room(sid, mode):
                start_game = True

            join_room(game_room)

            emit("join_game", {"username": username, "room": game_room}, to=sid)
            print(f"{username} is being added to room {game_room}")
            print(
                f"Home users: {self.context.room_manager.get_home_users()}\n Game rooms: {self.context.room_manager.get_rooms()}"
            )

            if start_game:

                sid_list = self.context.room_manager.get_room_sids(game_room)
                number_of_players = len(sid_list)
                color_list = self.context.board_manager.get_colors()

                self.context.board_manager.create_new_board(game_room)

                # Set time for players
                if mode == "PVP":

                    self.state.players_time[game_room] = [
                        self.starting_time,
                        self.starting_time,
                    ]
                    self.state.current_turn[game_room] = 0
                    self.context.socketio.start_background_task(self.count_time, game_room, mode)

                    self.state.game_history[game_room] = []

                def send_start():
                    
                    self.context.socketio.sleep(0.3)
                    for i in range(number_of_players):
                        color = color_list[i]
                        self.context.socketio.emit(
                            "start_game",
                            {"room": game_room, "color": color},
                            to=sid_list[i],
                        )
                        
                        self.state.sid_color[sid_list[i]] = color

                self.context.socketio.start_background_task(send_start)
                print(f"Room number: {game_room}, start the game")

                # Tell stockfish bot to begin the game if he is white

                if mode == "PVE" and color_list[0] == "black":

                    fen = self.context.board_manager.get_board_fen(game_room)
                    engine_move = self.context.stockfish.get_best_move(fen)
                    self.context.board_manager.push_board(engine_move, game_room)
                    fen = self.context.board_manager.get_board_fen(game_room)
                    emit("move", {"fen": fen}, to=sid)

        @self.context.socketio.on("cancel_matchmaking")
        def handle_cancel_matchmaking(data):
            room = data.get("room")
            sid = request.sid

            # Leave the current room
            self.context.room_manager.remove_from_room(sid)
            leave_room(room)

            self.home = self.context.room_manager.get_home()

            # Join home
            self.context.room_manager.add_to_home(sid)
            join_room(self.home)

            emit("join_home", {"username": sid, "room": self.home}, to=sid)
            print(f"{sid} canceld matchmaking and is now joining home")
            print(f"Home users: {self.context.room_manager.get_home_users()}")
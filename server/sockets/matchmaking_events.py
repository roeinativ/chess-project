from flask import request
from flask_socketio import join_room, leave_room, emit
import random


class MatchmakingEvents:
    def __init__(self,game_manager,socketio):

        self.game_manager = game_manager
        self.socketio = socketio
        self.matchmaking_events()

    def matchmaking_events(self):

        @self.socketio.on("join_home")
        def handle_join_home(data):

            username = data.get("username")
            sid = request.sid
            room = self.game_manager.HOME

            join_room(room)
            self.game_manager.add_to_waiting_room(sid)

            print(f"Home users: {self.game_manager.waiting_players} \n Game rooms: {self.game_manager.player_room}")

            emit("join_home", {"username": username, "room": room}, to=sid)

            print(f"Sending to {sid} join home emit")

        @self.socketio.on("join_game")
        def handle_join_game(data):
            start_game = False

            username = data.get("username")
            mode = data.get("mode")
            print(f"Mode got is {mode}")
            sid = request.sid

            room_id = self.game_manager.find_room(sid, mode)
            room = self.game_manager.get_room(room_id)

            if room.is_room_full():
                start_game = True

            join_room(room_id)

            emit("join_game", {"username": username, "room": room_id}, to=sid)
            print(f"{username} is being added to room {room_id}")
            print(
                f"Home users: {self.game_manager.waiting_players}\n Game rooms: {self.game_manager.player_room}"
            )

            if start_game:
                sid_list = room.players
                number_of_players = len(sid_list)
                color_list = self.game_manager.color_list
                random.shuffle(color_list)
                

                room.start_game()
                game = room.game

                # Set time for players
                game.start_players_time()

                self.socketio.start_background_task(game.count_time, self.socketio)

                def send_start():

                    self.socketio.sleep(0.3)
                    for i in range(number_of_players):
                        color = color_list[i]
                        self.socketio.emit(
                            "start_game",
                            {"room": room_id, "color": color},
                            to=sid_list[i],
                        )

                self.socketio.start_background_task(send_start)
                print(f"Room number: {room_id}, start the game")

                # Tell stockfish bot to begin the game if he is white

                
                if color_list[0] == "black":
                    response = game.engine_move()
                    fen = game.get_fen()

                    if response:
                        emit("move", {"valid": True,"fen": fen, "color": "white"}, to=sid)
                        print(f"Engine move {response['move']}")

        @self.socketio.on("cancel_matchmaking")
        def handle_cancel_matchmaking(data):
            room_id = data.get("room")
            sid = request.sid

            # Leave the current room

            room = self.game_manager.get_room(room_id)
            room.remove_player(sid)
            self.game_manager.remove_from_room(room_id, sid)

            leave_room(room_id)

            # Join home
            self.game_manager.add_to_waiting_room(sid)
            join_room(self.game_manager.HOME)

            emit("join_home", {"username": sid, "room": self.game_manager.HOME}, to=sid)
            print(f"{sid} canceld matchmaking and is now joining home")
            print(f"Home users: {self.game_manager.waiting_players} \n Game rooms: {self.game_manager.player_room}")

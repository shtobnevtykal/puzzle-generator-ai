import json
import chess

with open("puzzles.json", "r") as file:
    puzzles = json.load(file)
    for puzzle in puzzles:
        board = chess.Board(puzzle["fen"])
        print(board)
        
        while True:
            user_move = input("Enter your move:").strip().lower()
            if user_move == "quit":
                break
            elif user_move == puzzle["solution"]:
                print("Correct!")
                break
            else:
                print("Try again")
        if user_move == "quit":
            break
    

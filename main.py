import chess
import random
import chess.engine
import json

engine_path = r"C:\Users\azizd\Downloads\stockfish-windows-x86-64-universal\stockfish\stockfish-windows-x86-64-universal.exe"

puzzles = []

with chess.engine.SimpleEngine.popen_uci(engine_path) as engine:
    for i in range(3):
        board = chess.Board()
        for j in range(20):
            if board.is_game_over():
                break
            move = random.choice(list(board.legal_moves))
            board.push(move)
        print(f"Position {i+1}:\n{board}")
        print(board.fen())
        
        result = engine.analyse(board, chess.engine.Limit(time=0.5), multipv=2)
        if len(result) < 2:
            continue
        score1 = result[0]["score"].pov(board.turn).score()
        score2 = result[1]["score"].pov(board.turn).score()
        if score1 is None or score2 is None:
            continue
        best_move = result[0]["pv"][0]
        gap = score1 - score2
        if gap >= 200:
            puzzles.append({"fen": board.fen(), "solution": best_move.uci(), "gap": gap})
            print("Puzzle candidate")
        
        print(result[0]["score"])
        print(result[1]["score"])
        print(gap)
        
        second_best_move = result[1]["pv"][0]
        
        print(board.san(best_move))
        print(board.san(second_best_move))
print(puzzles)
with open("puzzles.json", "w") as file:
    json.dump(puzzles, file, indent=4)
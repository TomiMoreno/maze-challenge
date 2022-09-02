type Letter = "A" | "B" | "C" | "D" | "E";
type Maze = Letter[][];

type Path = {
  x: number;
  y: number;
  index: number;
  visited: number[][];
  increment: number;
};
export const mazeExample: Maze = [
  ["A", "B", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
  ["A", "C", "A", "D", "D", "E", "A", "C", "C", "C", "A", "A"],
  ["A", "C", "C", "D", "A", "E", "A", "D", "A", "D", "A", "A"],
  ["A", "A", "A", "A", "A", "E", "D", "D", "A", "D", "E", "A"],
  ["A", "C", "C", "D", "D", "D", "A", "A", "A", "A", "E", "A"],
  ["A", "C", "A", "A", "A", "A", "A", "D", "D", "D", "E", "A"],
  ["A", "D", "D", "D", "E", "E", "A", "C", "A", "A", "A", "A"],
  ["A", "A", "A", "A", "A", "E", "A", "C", "C", "D", "D", "A"],
  ["A", "A", "A", "A", "A", "D", "A", "A", "A", "A", "A", "A"],
  ["A", "A", "A", "A", "A", "D", "A", "C", "D", "D", "A", "A"],
  ["A", "A", "A", "A", "A", "D", "C", "C", "A", "D", "E", "B"],
  ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
];

const letterOrder: Letter[] = [
  "C",
  "C",
  "C",
  "D",
  "D",
  "D",
  "E",
  "E",
  "E",
  "D",
  "D",
  "D",
];

function getLetter(index: number): Letter {
  const len = letterOrder.length;
  // Double mod to allow negative numbers
  const letterIndex = (len + (index % len)) % len;
  return letterOrder[letterIndex];
}

function findInMaze(letter: Letter, maze: Maze) {
  const solutions: number[][] = [];
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[0].length; j++) {
      if (maze[i][j] === letter) {
        solutions.push([i, j]);
      }
    }
  }
  return solutions;
}

function hasVisited(current: number[], visited: number[][]) {
  return visited.some(([x, y]) => x === current[0] && y === current[1]);
}

function checkNeighbours({
  letter,
  x,
  y,
  maze,
}: {
  letter: Letter;
  x: number;
  y: number;
  maze: Maze;
}) {
  const positions: number[][] = [];
  const mazeWidth = maze.length;
  const mazeHeight = maze[0].length;
  if (x > 0 && maze[x - 1][y] === letter) positions.push([x - 1, y]);
  if (x < mazeWidth && maze[x + 1][y] === letter) positions.push([x + 1, y]);
  if (y < mazeHeight && maze[x][y + 1] === letter) positions.push([x, y + 1]);
  if (y > 0 && maze[x][y - 1] === letter) positions.push([x, y - 1]);
  return positions;
}

function solveMaze(maze: Maze) {
  // First find first b position
  const initialBs = findInMaze("B", maze);
  const currentPaths: Path[] = initialBs
    .map(([initialX, initialY]) =>
      checkNeighbours({
        letter: "C",
        x: initialX,
        y: initialY,
        maze,
      }).map(([x, y]) => ({
        index: 0,
        visited: [
          [initialX, initialY],
          [x, y],
        ],
        increment: 1,
        x,
        y,
      }))
    )
    .flat();
  while (currentPaths.length > 0) {
    const { x, y, index, increment, visited } = currentPaths.shift() as Path;
    if (
      checkNeighbours({
        x,
        y,
        maze,
        letter: "B",
      }).filter((postition) => !hasVisited(postition, visited)).length > 0
    ) {
      console.log("WIN");
      return visited;
    }
    const neighbours = checkNeighbours({
      x,
      y,
      maze,
      letter: getLetter(index + increment),
    });
    const filteredNeighbours = neighbours
      .filter((postition) => !hasVisited(postition, visited))
      .map(([x, y]) => ({
        index: index + increment,
        visited: [...visited, [x, y]],
        increment,
        x,
        y,
      }));
    currentPaths.push(...filteredNeighbours);
  }
}

const solvePath = solveMaze(mazeExample);

solvePath?.forEach(([x, y]) => {
  mazeExample[x][y] = mazeExample[x][y].toLowerCase() as Letter;
});

console.table(mazeExample);

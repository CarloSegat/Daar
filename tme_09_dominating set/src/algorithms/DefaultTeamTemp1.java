//package algorithms;
//
//import java.awt.Point;
//import java.util.*;
//
//import java.util.stream.Collectors;
//
//public class DefaultTeam {
//
//    private static final double DISTANCE_THRESH_2K = 1.95;
//    private float edgeThreshold;
//    private ArrayList<Point> points;
//    private List<Point> cover;
//    private Map<Point, List<Point>> coverToCovertee;
//    private Map<Point, List<Point>> coverteeToCovers;
//
//    public ArrayList<Point> calculDominatingSet(ArrayList<Point> points, int edgeThreshold) {
//        this.edgeThreshold = edgeThreshold;
//        this.points = points;
//        this.coverToCovertee = new HashMap<>();
//        this.coverteeToCovers = new HashMap<>();
//
//        int minSize = points.size();
//        List<Point> result = null;
//
//        for(int tries = 0; tries < 20; tries++){
//            this.coverToCovertee = new HashMap<>();
//            this.coverteeToCovers = new HashMap<>();
//            List<List<Point>> adj = getGraphAsAdjecencyList();
//            ArrayList<Point> randomSolution = (ArrayList<Point>) getRandomSolution(adj);
//            int oldSize;
//
//            do {
////            System.out.println("One loop");
//                oldSize = randomSolution.size();
//                randomSolution = (ArrayList<Point>) doK2LocalSearch(randomSolution, points);
////            System.out.format("Old score: %d, new score %d", oldSize, randomSolution.size());
////            System.out.flush();
//            } while (oldSize > randomSolution.size());
//            if(randomSolution.size() < minSize){
//                minSize = randomSolution.size();
//                result = randomSolution;
//            }
//        }
//        result.addAll(getDegree0Nodes());
//        return (ArrayList<Point>) result;
//    }
//
//    private List<List<Point>> getGraphAsAdjecencyList() {
//        List<List<Point>> adj = new ArrayList<>();
//        for (int i = 0; i < points.size(); i++) {
//            for (Point neig : getNeighbours(points.get(i), points, this.edgeThreshold)) {
//                adj.add(new ArrayList<>(Arrays.asList(points.get(i), neig)));
//            }
//        }
//        return adj;
//    }
//
//    private List<Point> getRandomSolution(List<List<Point>> adj) {
//        List<Point> result = new ArrayList<>();
//        List<Point> covered = new ArrayList<>();
//        Collections.shuffle(adj);
//        for (List<Point> edge : adj) {
//            for (Point n : edge) {
//                if (!covered.contains(n)) {
//                    result.add(n);
//                    covered.add(n);
//
//                    ArrayList<Point> coverteeOfThis = getNeighbours(n, points, this.edgeThreshold);
//                    coverteeOfThis.add(n);
//
//                    coverteeOfThis.forEach(p -> {
//                        covered.add(p);
//                        List<Point> old = coverteeToCovers.getOrDefault(p, new ArrayList<>());
//                        old.add(n);
//                        coverteeToCovers.put(p, old);
//                    });
//
//                    coverToCovertee.put(n, coverteeOfThis);
//                }
//            }
//        }
//        // the adjecency list wont cosider nodes with degree zero
//        return result;
//    }
//
//    private List<Point> doK2LocalSearch(List<Point> cover, List<Point> points) {
//        for (int outer_i = 0; outer_i < cover.size(); outer_i++) {
//            for (int inner_i = outer_i; inner_i < cover.size(); inner_i++) {
//                Point p = cover.get(outer_i);
//                Point p2 = cover.get(inner_i);
//                if (p.distance(p2) > (edgeThreshold * DISTANCE_THRESH_2K)) {
//                    continue;
//                }
//                if (p == p2) {
//                    continue;
//                }
//                List<Point> uniqueCoverteesOfPair = getUniqueCoverteesOfPair(p, p2);
//                for (Point out : points) {
//                    if (getCentroid(Arrays.asList(p, p2)).distance(out) > edgeThreshold * DISTANCE_THRESH_2K) {
//                        continue;
//                    }
//                    ArrayList<Point> coverteesOfOut = getNeighbours(out, points, this.edgeThreshold);
//                    coverteesOfOut.add(out);
//                    if (coverteesOfOut.containsAll(uniqueCoverteesOfPair)) {
//
////                        System.out.println("improved");
//                        coverToCovertee.get(p2).forEach(covertee -> coverteeToCovers.get(covertee).remove(p2));
//                        coverToCovertee.get(p).forEach(covertee -> coverteeToCovers.get(covertee).remove(p));
//                        coverteeToCovers.get(p).remove(p);
//                        coverteeToCovers.get(p2).remove(p2);
//                        coverToCovertee.remove(p);
//                        coverToCovertee.remove(p2);
//
//                        coverToCovertee.put(out, coverteesOfOut);
//                        coverteeToCovers.get(out).remove(p);
//                        coverteeToCovers.get(out).remove(p2);
//                        coverteeToCovers.get(out).add(out);
//                        coverteesOfOut.forEach(cov -> coverteeToCovers.get(cov).add(out));
//
//                        cover.remove(p);
//                        cover.remove(p2);
//                        cover.add(out);
//                        return cover;
//                    }
//                }
//            }
//        }
//        return cover;
//    }
//
//    private List<Point> getUniqueCoverteesOfPair(Point... _points) {
//        ArrayList<Point> points = new ArrayList<>(Arrays.asList(_points));
////      System.out.println("p");
////      System.out.println(p);
////      System.out.println("p2");
////      System.out.println(p2);
//        Set<Point> coverteesOfPair = new HashSet<>();
//        points.stream().forEach(p -> coverteesOfPair.addAll(coverToCovertee.getOrDefault(p, new ArrayList<>())));
//
//        List<Point> result = new ArrayList<>();
//        for (Point covertee : coverteesOfPair) {
//            if (coverteeToCovers.get(covertee).stream().allMatch(cover -> points.contains(cover))) {
//                // add a point if it's only covered by this pair of nodes
//                result.add(covertee);
////        System.out.println("adding one unique");
//            }
//        }
//        return result;
//    }
//
//    private Point getCentroid(List<Point> points) {
//        int sumX = 0;
//        int sumY = 0;
//        for (Point p : points) {
//            sumX += p.x;
//            sumY += p.y;
//        }
//        return new Point(sumX / points.size(), sumY / points.size());
//    }
//
//    private ArrayList<Point> getNeighbours(Point p, List<Point> vertices, float edgeThreshold) {
//        ArrayList<Point> result = new ArrayList();
//        Iterator var5 = vertices.iterator();
//
//        while (var5.hasNext()) {
//            Point point = (Point) var5.next();
//            if (point.distance(p) < (double) edgeThreshold && !point.equals(p)) {
//                result.add((Point) point.clone());
//            }
//        }
//
//        return result;
//    }
//
//    private ArrayList<Point> getDegree0Nodes() {
//        return (ArrayList<Point>) this.points.stream().filter(p -> getNeighbours(p, points, this.edgeThreshold).size() == 0).collect(Collectors.toList());
//    }
//}
//
//
////  //FILE PRINTER
////  private void saveToFile(String filename,ArrayList<Point> result){
////    int index=0;
////    try {
////      while(true){
////        BufferedReader input = new BufferedReader(new InputStreamReader(new FileInputStream(filename+Integer.toString(index)+".points")));
////        try {
////          input.close();
////        } catch (IOException e) {
////          System.err.println("I/O exception: unable to close "+filename+Integer.toString(index)+".points");
////        }
////        index++;
////      }
////    } catch (FileNotFoundException e) {
////      printToFile(filename+Integer.toString(index)+".points",result);
////    }
////  }
////  private void printToFile(String filename,ArrayList<Point> points){
////    try {
////      PrintStream output = new PrintStream(new FileOutputStream(filename));
////      int x,y;
////      for (Point p:points) output.println(Integer.toString((int)p.getX())+" "+Integer.toString((int)p.getY()));
////      output.close();
////    } catch (FileNotFoundException e) {
////      System.err.println("I/O exception: unable to create "+filename);
////    }
////  }
////
////  //FILE LOADER
////  private ArrayList<Point> readFromFile(String filename) {
////    String line;
////    String[] coordinates;
////    ArrayList<Point> points=new ArrayList<Point>();
////    try {
////      BufferedReader input = new BufferedReader(
////              new InputStreamReader(new FileInputStream(filename))
////      );
////      try {
////        while ((line=input.readLine())!=null) {
////          coordinates=line.split("\\s+");
////          points.add(new Point(Integer.parseInt(coordinates[0]),
////                  Integer.parseInt(coordinates[1])));
////        }
////      } catch (IOException e) {
////        System.err.println("Exception: interrupted I/O.");
////      } finally {
////        try {
////          input.close();
////        } catch (IOException e) {
////          System.err.println("I/O exception: unable to close "+filename);
////        }
////      }
////    } catch (FileNotFoundException e) {
////      System.err.println("Input file not found.");
////    }
////    return points;
////  }
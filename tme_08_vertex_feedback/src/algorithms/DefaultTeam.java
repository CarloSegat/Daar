package algorithms;

import java.awt.Point;
import java.util.*;
import java.util.stream.Collectors;

public class DefaultTeam {

    private Random random = new Random();
    private int ATTEMPTS = 300;

    public ArrayList<Point> calculFVS(ArrayList<Point> points, int edgeThreshold) {

        ArrayList<Point> lowDegree = new ArrayList<>();
        Map<Integer, Integer> nodeTransitiveRatioMap = new HashMap<>();
        for(int nn = 0; nn < points.size(); nn++){
            if(neighbor(points.get(nn), points, edgeThreshold).size() <= 1){
                lowDegree.add(points.get(nn));
            }
            nodeTransitiveRatioMap.put(nn, this.calculateTransitiveRatio(points.get(nn), points, edgeThreshold));
        }

        ArrayList<ArrayList<Point>> solutions = new ArrayList<ArrayList<Point>>();
        for (int i = 0; i < 200; i++) {
            ArrayList<Point> sol = calculFVS_remove_1(points, edgeThreshold, lowDegree, nodeTransitiveRatioMap);
            solutions.add(sol);
        }
        Optional<ArrayList<Point>> min = solutions.stream().min(Comparator.comparingInt(ArrayList::size));
        return min.get();
    }

    private List<Point> sortByDegree(List<Point> points, int edgeThreshold) {
        List<Point> collect = points.stream()
                .sorted(
                        Comparator.comparingInt(p -> -1 * neighbor(p, points, edgeThreshold).size()))
                .collect(Collectors.toList());
        return collect;
    }

    public ArrayList<Point> calculFVS_remove_1(ArrayList<Point> points, int edgeThreshold, ArrayList<Point> excludeFromFVS, Map<Integer, Integer> nodeTransitiveRatioMap) {

        ArrayList<ArrayList<Point>> pair = getRandomFVS(points, edgeThreshold, 0.3d, excludeFromFVS, nodeTransitiveRatioMap);
        ArrayList<Point> fvs = pair.get(0);
        ArrayList<Point> others = pair.get(1);
        int giveUp = this.ATTEMPTS;
        while (giveUp > 0 && others.size() > 0) {
            Point point1 = fvs.get(random.nextInt(others.size())); // getLowestTransitiveRatio(fvs, edgeThreshold);
            others.add(point1);
            fvs.remove(point1);
            if (isValid(points, fvs, edgeThreshold)) {
                giveUp = this.ATTEMPTS;
            } else {
                giveUp--;
                fvs.add(point1);
                others.remove(point1);
            }
        }
        return fvs;
    }

    private Point getLowestTransitiveRatio(List<Point> points, int edgeThreshold){
        int minTR = 999999;
        Point best = null;
        for(int i = 0; i < points.size(); i++){
            int tr = calculateTransitiveRatio(points.get(i), points, edgeThreshold);
            if(tr < minTR){
                minTR = tr;
                best = points.get(i);
            }
        }
        return best;
    }

    private int calculateTransitiveRatio(Point p, List<Point> points, int edgeThreshold){
        ArrayList<Point> neighbours = neighbor(p, points, edgeThreshold);
        if(neighbours.size() < 2){
            return 0;
        }
        int denominator = ((neighbours.size() - 1) * neighbours.size()) / 2;
        int nominator = 0;
        for (Point neig: neighbours) {
            for (Point neig2: neighbor(p, points, edgeThreshold)) {
                if (neig == neig2){continue;}
                    if(neighbor(neig2, points, edgeThreshold).contains(neig)){
                        nominator++;
                    }
            }
        }
        return (nominator / 2) / denominator;
    }

    private ArrayList<ArrayList<Point>> getRandomFVS(ArrayList<Point> points, int edgeThreshold, double prob, List<Point> excludeFromFVS, Map<Integer, Integer> nodeTransitiveRatioMap) {
        ArrayList<Point> fvs = new ArrayList<Point>();
        ArrayList<Point> others = new ArrayList<Point>();

        while (!isValid(points, fvs, edgeThreshold)) {
            fvs = new ArrayList<Point>();
            others = new ArrayList<Point>();
            for (int i = 0; i < points.size(); i++) {
                Double tr = nodeTransitiveRatioMap.get(i) * 0.75;
                if (this.random.nextDouble() + tr > prob && ! excludeFromFVS.contains(points.get(i)))
                    fvs.add(points.get(i));
                else {
                    others.add(points.get(i));
                }
            }
        }
        return new ArrayList<>(Arrays.asList(fvs, others));
    }


    private boolean isMember(List<Point> points, Point p) {
        Iterator var3 = points.iterator();

        Point point;
        do {
            if (!var3.hasNext()) {
                return false;
            }

            point = (Point) var3.next();
        } while (!point.equals(p));

        return true;
    }

    public boolean isValid(List<Point> origPoints, List<Point> fvs, int edgeThreshold) {
        ArrayList<Point> vertices = new ArrayList();
        Iterator var5 = origPoints.iterator();

        while (var5.hasNext()) {
            Point p = (Point) var5.next();
            if (!this.isMember(fvs, p)) {
                vertices.add((Point) p.clone());
            }
        }

        while (!vertices.isEmpty()) {
            ArrayList<Point> green = new ArrayList();
            green.add((Point) ((Point) vertices.get(0)).clone());
            ArrayList black = new ArrayList();

            while (!green.isEmpty()) {
                Iterator var7 = this.neighbor((Point) green.get(0), vertices, edgeThreshold).iterator();

                while (var7.hasNext()) {
                    Point p = (Point) var7.next();
                    if (!((Point) green.get(0)).equals(p)) {
                        if (this.isMember(black, p)) {
                            return false;
                        }

                        if (this.isMember(green, p)) {
                            return false;
                        }

                        green.add((Point) p.clone());
                    }
                }

                black.add((Point) ((Point) green.get(0)).clone());
                vertices.remove(green.get(0));
                green.remove(0);
            }
        }

        return true;
    }

    private ArrayList<Point> neighbor(Point p, List<Point> vertices, int edgeThreshold) {
        ArrayList<Point> result = new ArrayList();
        Iterator var5 = vertices.iterator();

        while (var5.hasNext()) {
            Point point = (Point) var5.next();
            if (point.distance(p) < (double) edgeThreshold && !point.equals(p)) {
                result.add((Point) point.clone());
            }
        }

        return result;
    }
}

package algorithms;

import java.awt.Point;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class DefaultTeam {

    public ArrayList<ArrayList<Point>> calculKMeans(ArrayList<Point> points) {
        ArrayList<ArrayList<Point>> partitions = null;

        List<Point> centers = DefaultTeam.sample(points, 5);

        for(int refinements = 10; refinements > 0; refinements--){
            partitions = generateEmptyPartitions(5);
            final List<Point> finalCenters = centers;
            final ArrayList<ArrayList<Point>> finalPartitions = partitions;
            points.forEach(p -> {
                double currentMin = 99999;
                int currentDex = 0;
                for (int i = 0; i < 5; i++) {
                    if(finalCenters.get(i).distanceSq(p) < currentMin){
                        currentMin = finalCenters.get(i).distanceSq(p);
                        currentDex = i;
                    }
                }
                finalPartitions.get(currentDex).add(p);
            });

            centers = DefaultTeam.updateCenters(finalPartitions);
        }

        return partitions;
    }

    private static List<Point> updateCenters(ArrayList<ArrayList<Point>> partitions) {
        return partitions
                .stream()
                .map(DefaultTeam::caculateCentroid)
                .collect(Collectors.toList());
    }

    public static <T> List<T> sample(List<T> list, int n) {
        return Stream
                .generate(() -> list.remove((int) (list.size() * Math.random())))
                .limit(Math.min(list.size(), n))
                .collect(Collectors.toList());
    }

    public static ArrayList<ArrayList<Point>> generateEmptyPartitions(int k) {
        ArrayList<ArrayList<Point>> partitions = new ArrayList<ArrayList<Point>>();
        for (int i = 0; i < k; i++) {
            partitions.add(new ArrayList<Point>());
        }
        return partitions;
    }

    static private Point caculateCentroid(List<Point> points)  {
        double centroidX = 0, centroidY = 0;

        for(Point p : points) {
            centroidX += p.x;
            centroidY += p.y;
        }
        return new Point((int)(centroidX / points.size()), (int)(centroidY / points.size()));
    }

    public ArrayList<ArrayList<Point>> calculKMeansBudget(ArrayList<Point> points) {

        ArrayList<Point> rouge = new ArrayList<Point>();
        ArrayList<Point> verte = new ArrayList<Point>();

        for (int i = 0; i < points.size() / 2; i++) {
            rouge.add(points.get(i));
            verte.add(points.get(points.size() - i - 1));
        }
        if (points.size() % 2 == 1) rouge.add(points.get(points.size() / 2));

        ArrayList<ArrayList<Point>> kmeans = new ArrayList<ArrayList<Point>>();
        kmeans.add(rouge);
        kmeans.add(verte);

        /*******************
         * PARTIE A ECRIRE *
         *******************/
        return kmeans;
    }
}

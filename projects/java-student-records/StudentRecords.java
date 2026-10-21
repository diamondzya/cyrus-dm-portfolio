import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * StudentRecords — a small console grade book.
 *
 * Keeps a class list, averages each student's grades, ranks the class from
 * highest to lowest, and reports how many passed. The passing mark is 75,
 * the Philippine standard.
 *
 * Build and run:
 *   javac StudentRecords.java
 *   java StudentRecords
 */
public class StudentRecords {

    /** Passing mark used by Philippine schools. */
    static final int PASSING = 75;

    /** One student and their grades. */
    static class Student {
        private final String name;
        private final String section;
        private final List<Integer> grades = new ArrayList<>();

        Student(String name, String section) {
            this.name = name;
            this.section = section;
        }

        void addGrade(int grade) {
            if (grade < 0 || grade > 100) {
                throw new IllegalArgumentException("grade out of range: " + grade);
            }
            grades.add(grade);
        }

        double average() {
            return grades.stream().mapToInt(Integer::intValue).average().orElse(0);
        }

        boolean passed() {
            return average() >= PASSING;
        }

        String row() {
            return String.format("%-18s %-9s %7.2f   %s",
                    name, section, average(), passed() ? "Passed" : "Failed");
        }
    }

    static Student student(String name, String section, int... grades) {
        Student s = new Student(name, section);
        for (int grade : grades) {
            s.addGrade(grade);
        }
        return s;
    }

    public static void main(String[] args) {
        List<Student> classList = new ArrayList<>(List.of(
                student("Cyrus Madriaga", "IT MAWD", 92, 88, 85),
                student("Andrea Santos", "IT MAWD", 79, 84, 90),
                student("Miguel Reyes", "IT MAWD", 71, 68, 74)
        ));

        classList.sort(Comparator.comparingDouble(Student::average).reversed());

        System.out.println("RANK  " + String.format("%-18s %-9s %7s   %s",
                "NAME", "SECTION", "AVERAGE", "STATUS"));
        System.out.println("-".repeat(56));

        for (int i = 0; i < classList.size(); i++) {
            System.out.printf("%-5d %s%n", i + 1, classList.get(i).row());
        }

        long passed = classList.stream().filter(Student::passed).count();
        System.out.printf("%n%d of %d students passed.%n", passed, classList.size());
    }
}

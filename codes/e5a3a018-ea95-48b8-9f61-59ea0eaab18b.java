import java.util.Scanner;
public class MatSym {
    int A[][], M
    void input() {
        Scanner in = new Scanner(System.in);
        M = in.nextInt();
        if(!(M > 2 && M < 10)) {
            System.out.println("SIZE IS OUT OF RANGE");
            System.exit(0);
        }
        System.out.println("Enter Matrix elements");
        A = new int[M][M];
        for(int i = 0 ; i < M ; i++)
            for(int j = 0 ; j < M ; j++)
                A[i][j] = in.nextInt();
    }
    boolean isSym() {
        for(int i = 0 ; i < M ; i++)
            for(int j = 0 ; j < M ; j++)
                if(A[i][j] != A[j][i]) 
                    return false;  
        return true;
    }
    int getDiagonalSum(char dir) {
        int sum = 0;
        switch(dir) {
            case 'l':
            for(int i = 0 ; i < M ; i++)
                sum += A[i][i];
            break;
            case 'r':
            for(int i = M - 1, j = 0 ; i >= 0 && j < M ; i--, j++)
                sum += A[i][j];
            break;
        }
        return sum;
    }
    void display() {
        for(int i = 0 ; i < M ; i++) {
            for(int j = 0 ; j < M ; j++)
                System.out.print(A[i][j] + " ");
            System.out.println();
        }
        System.out.println("THE GIVEN MATRIX IS " + ((isSym())?"":"NOT ") + "SYMMETRIC");
        System.out.println("The sum of the left diagonal = " + getDiagonalSum('l'));
        System.out.println("The sum of the right diagonal = " + getDiagonalSum('r'));
    }
    public static void main(String[]args) {
        MatSym ob = new MatSym();
        ob.input();
        ob.display();
    }
}
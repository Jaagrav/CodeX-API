import java.util.*;
class FiboString
{
    String w,v,g;
    int n;
    FiboString()
    {
        w="a";
        v="b";
        g="ba";
    }

    void accept()
    {
        Scanner in = new Scanner (System.in);
        System.out.println ("Enter number of terms");
        n = in.nextInt();
    }

    void generate()
    {
        System.out.print(w+" ");
        System.out.print(v+" ");
        for(int i=0; i<=n-2; i++)
        {
            System.out.print(g+" ");
            w=v;
            v=g;
            g= v.concat(w);
        }
    }

    public static void main()
    {
        FiboString ob=new FiboString();
        ob.accept();
        ob.generate();
    }//end of main()
}//end of class

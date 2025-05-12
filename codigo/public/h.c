#include "io.h"
int main ()
{
    int n=5, x=4, y=n, z=0;
    while (z<y)
        {x = x + 4*z +1;
        if ( x%7 ==0 )
        { y = y +1;}
         else {printf ( "%d", x);}
         z =z+1;
    return (0);
        }
}

#include<bits/stdc++.h>
using namespace std;

int main()
{
    int t; 
    cin>> t;
    while(t--){
        int a,b,c,d;
        cin>>a>>b>>c>>d;
        int p,q,r;

        p = a+b; q = c-b; r = d-c;

        if(p==q && q==r && p==r){
            cout<<3<<endl;
        }
        else if(p!=q && q!=r && p!=r){
            cout<<1<<endl;
        }
        else{
            cout<<2<<endl;
        }
    }
    return 0;
}
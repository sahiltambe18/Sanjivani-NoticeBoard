import prisma from '@/prisma';
import NextAuth, { AuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';
import Credentials from 'next-auth/providers/credentials';

const authOptions = {
    providers:[
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "email" , type:"email" , placeholder:"admin email"},
                password: {label:"Password" , type:"password" , placeholder:"password"}
            },
            async authorize(credentials,req) {
                //get user and return it
                if(!credentials?.email || !credentials.password) return null;

                const admin = await prisma.admins.findFirst({where:{
                    email:credentials.email
                }});

                if(!admin) return null;
                
                
                const isSame = await bcrypt.compare(credentials.password,admin.password )   
                
                console.log(isSame)
                if(isSame) return admin

                return null
                
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    
} satisfies AuthOptions;


const handler = NextAuth(authOptions)

export  {handler as GET , handler as POST};
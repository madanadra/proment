import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value
    const unauth = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup'
    const toLogin = NextResponse.redirect(new URL('/login', req.url))
    const toBase = NextResponse.redirect(new URL('/', req.url))
    const next = NextResponse.next()
    const parameter = req.nextUrl.searchParams.get('token')

    if (token) {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL+'/api/check?token='+token, {
                cache: 'no-cache'
            })

            const auth = await res.json()
            
            if (auth) {
                if (unauth) {
                    return toBase
                } else {
                    if (parameter) {
                        next.cookies.delete('auth-token')
                        return next
                    } else {
                        return next
                    }
                }
            } else {
                if (unauth) {
                    next.cookies.delete('auth-token')
                    return next
                } else {
                    toLogin.cookies.delete('auth-token')
                    return toLogin
                }
            }
        } catch {
            if (unauth) {
                return next
            } else {
                return toLogin
            }
        }
    } else {
        if (unauth) {
            if (parameter) {
                toBase.cookies.set('auth-token', parameter, { 
                    httpOnly: true,
                    secure: true,
                    sameSite: 'lax',
                    maxAge: 3600*24*7
                })
                return toBase
            } else {
                return next
            }
        } else {
            return toLogin
        }
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)']
}
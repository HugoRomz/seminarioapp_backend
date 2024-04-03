import nodemailer from 'nodemailer'


export function createTransport(host, port, user, pass) {
    
    return nodemailer.createTransport({
        host: host,
        port: port,
        auth: {
            user: user,
            pass: pass
        }
    });
}
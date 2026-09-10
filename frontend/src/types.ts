export type Role='STUDENT'|'ADMIN';
export interface AuthResponse{token:string;email:string;role:Role}
export interface Student{id:number;fullName:string;rollNumber:string;department?:string;year?:string;phone?:string;user?:{email:string}}
export interface Complaint{id:number;title:string;description:string;category?:string;status:'OPEN'|'IN_PROGRESS'|'RESOLVED'|'CLOSED';createdAt:string;student?:Student}
export interface Event{id?:number;title:string;description?:string;eventDate:string;venue?:string;organizer?:string}
export interface Notice{id?:number;title:string;content:string;category?:string;publishedAt?:string;active?:boolean}

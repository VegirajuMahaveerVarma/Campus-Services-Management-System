package com.campus.exception;
import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.NoSuchElementException;
@RestControllerAdvice public class GlobalExceptionHandler {
 record ApiError(Instant timestamp,int status,String message,String path){}
 @ExceptionHandler(NoSuchElementException.class) ResponseEntity<ApiError> notFound(NoSuchElementException e,org.springframework.web.context.request.WebRequest r){return response(404,e.getMessage(),r);}
 @ExceptionHandler({IllegalArgumentException.class,MethodArgumentNotValidException.class}) ResponseEntity<ApiError> bad(Exception e,org.springframework.web.context.request.WebRequest r){return response(400,e.getMessage(),r);}
 @ExceptionHandler(Exception.class) ResponseEntity<ApiError> generic(Exception e,org.springframework.web.context.request.WebRequest r){return response(500,"Internal server error",r);}
 private ResponseEntity<ApiError> response(int s,String m,org.springframework.web.context.request.WebRequest r){return ResponseEntity.status(s).body(new ApiError(Instant.now(),s,m,r.getDescription(false).replace("uri=","")));}
}

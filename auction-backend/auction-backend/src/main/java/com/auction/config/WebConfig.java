package com.auction.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AdminCheckInterceptor())
            .addPathPatterns(
                "/api/faq", "/api/faq/*",
                "/api/notice", "/api/notice/*",
                "/api/event", "/api/event/*",
                "/api/inquiry/all", "/api/inquiry/{id}", "/api/inquiry/*"
            )
            .order(1);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    // FAQ/공지/이벤트 등록/수정/삭제에만 적용 (POST, PUT, DELETE)
    private static class AdminCheckInterceptor implements HandlerInterceptor {
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            String method = request.getMethod();
            String uri = request.getRequestURI();
            boolean isAdminApi = (
                uri.startsWith("/api/faq") ||
                uri.startsWith("/api/notice") ||
                uri.startsWith("/api/event")
            );
            if (isAdminApi && (method.equals("POST") || method.equals("PUT") || method.equals("DELETE"))) {
                String adminHeader = request.getHeader("X-ADMIN");
                if (!"true".equals(adminHeader)) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("관리자만 가능합니다.");
                    return false;
                }
            }
            return true;
        }
    }
}

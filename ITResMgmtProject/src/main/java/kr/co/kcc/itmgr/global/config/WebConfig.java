package kr.co.kcc.itmgr.global.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import kr.co.kcc.itmgr.global.auth.LoginInterceptor;

@Component
public class WebConfig implements WebMvcConfigurer{
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new LoginInterceptor()) // LogInterceptor 등록
				.order(1)	// 적용할 필터 순서 설정
				.addPathPatterns("/**")
				.excludePathPatterns("/signin"); // 인터셉터에서 제외할 패턴
	}
}
  
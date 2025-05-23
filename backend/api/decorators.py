from functools import wraps
from django.core.cache import cache
from django.conf import settings
import hashlib
import json

def cache_response(timeout=None, key_prefix='view'):
    """
    Cache decorator for views
    Usage: @cache_response(timeout=300, key_prefix='interview_list')
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # Generate cache key based on request parameters
            cache_key = f"{key_prefix}:{request.path}"
            
            # Add query parameters to cache key if they exist
            if request.GET:
                query_string = json.dumps(dict(request.GET.items()), sort_keys=True)
                query_hash = hashlib.md5(query_string.encode()).hexdigest()
                cache_key = f"{cache_key}:{query_hash}"
            
            # Try to get cached response
            response = cache.get(cache_key)
            
            if response is None:
                # If not in cache, get response from view
                response = view_func(request, *args, **kwargs)
                
                # Cache the response
                cache_timeout = timeout if timeout is not None else settings.CACHE_TTL
                cache.set(cache_key, response, cache_timeout)
            
            return response
        return _wrapped_view
    return decorator

def cache_method(timeout=None, key_prefix='method'):
    """
    Cache decorator for methods
    Usage: @cache_method(timeout=300, key_prefix='get_interview_data')
    """
    def decorator(method):
        @wraps(method)
        def _wrapped_method(self, *args, **kwargs):
            # Generate cache key based on method name and arguments
            method_args = json.dumps(args, sort_keys=True)
            method_kwargs = json.dumps(kwargs, sort_keys=True)
            cache_key = f"{key_prefix}:{method.__name__}:{method_args}:{method_kwargs}"
            
            # Try to get cached result
            result = cache.get(cache_key)
            
            if result is None:
                # If not in cache, get result from method
                result = method(self, *args, **kwargs)
                
                # Cache the result
                cache_timeout = timeout if timeout is not None else settings.CACHE_TTL
                cache.set(cache_key, result, cache_timeout)
            
            return result
        return _wrapped_method
    return decorator 
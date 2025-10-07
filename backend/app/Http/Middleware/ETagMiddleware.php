<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ETagMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Handle only GET and HEAD requests
        if (! $request->isMethod('get') && ! $request->isMethod('head')) {
            return $next($request);
        }

        // Get the initial response
        $response = $next($request);

        // Generate ETag from response content
        $etag = md5($response->getContent());
        $response->setEtag($etag);

        // Check if the ETag matches the one sent by the client
        if ($response->isNotModified($request)) {
            return $response; // Returns 304 Not Modified
        }

        // Set the Last-Modified header
        if ($response->headers->has('Date')) {
            $response->setLastModified(new \DateTime($response->headers->get('Date')));
        }

        return $response;
    }
}
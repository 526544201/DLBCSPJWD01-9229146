<?php 
    // Load the firebase library
    require_once("php-jwt-main/src/JWT.php"); 
    require_once("php-jwt-main/src/Key.php");
    require_once("php-jwt-main/src/SignatureInvalidException.php");
    require_once("php-jwt-main/src/BeforeValidException.php");
    require_once("php-jwt-main/src/ExpiredException.php");

    use \Firebase\JWT\JWT; // Import the JWT class
    use \Firebase\JWT\Key; // Import the Key class
    use \Firebase\JWT\SignatureInvalidException; // Import the SignatureInvalidException class
    use \Firebase\JWT\BeforeValidException; // Import the BeforeValidException class
    use Firebase\JWT\ExpiredException; // Import the ExpiredException class

    function validateToken($token) {
        $secretKey = 'czc$Mr#gfnSGCFgbdLpjyY$Ym@7@6K8L';

        // Validate Token
        try {
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));
            return $decodedToken->sub; // Return the user id
        } catch (SignatureInvalidException $e) {
            http_response_code(401);
            echo json_encode(array( 
                "message" => "Invalid token signature." 
            ));
            die();
        } catch (BeforeValidException $e) {
            http_response_code(401);
            echo json_encode(array( 
                "message" => "Token is not yet valid." 
            ));
            die();
        } catch (ExpiredException $e) {
            http_response_code(401);
            echo json_encode(array( 
                "message" => "Token has expired." 
            ));
            die();
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array( 
                "message" => "Invalid token.",
                "usedToken: " => $token
            ));
            die();
        }
    }
?>
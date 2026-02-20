<?php
$current_page = '';
$page_title = 'Page Not Found';
$page_description = 'The page you were looking for could not be found.';
include 'includes/header.php';
?>

    <!-- 404 Section -->
    <section class="section section--dark" style="min-height: 80vh; display: flex; align-items: center; padding-top: 120px;">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6 text-center">
                    <h1 style="font-size: clamp(4rem, 10vw, 8rem); color: var(--color-accent);">404</h1>
                    <h2>Page Not Found</h2>
                    <div class="art-deco-divider"></div>
                    <p class="mt-3">Sorry, the page you're looking for doesn't exist or has been moved.</p>
                    <a href="index.php" class="btn btn-vertex mt-4">Back to Home</a>
                </div>
            </div>
        </div>
    </section>

<?php include 'includes/footer.php'; ?>

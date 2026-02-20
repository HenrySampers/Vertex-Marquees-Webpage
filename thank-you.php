<?php
session_start();
$current_page = 'contact';
$page_title = 'Thank You';
$page_description = 'Thank you for your quote request. Vertex Marquees will be in touch within 24 hours.';
include 'includes/header.php';
?>

    <!-- Thank You Section -->
    <section class="section section--dark" style="min-height: 80vh; display: flex; align-items: center; padding-top: 120px;">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6 text-center">
                    <i class="bi bi-check-circle" style="font-size: 5rem; color: var(--color-accent); display: block; margin-bottom: 1.5rem;"></i>
                    <h1>Thank You!</h1>
                    <div class="art-deco-divider"></div>
                    <p class="mt-3">Your quote request has been received. We'll be in touch within 24 hours to discuss your event.</p>
                    <p>If you need to reach us sooner, call us at <a href="tel:<?php echo $business_phone_link; ?>" style="color: var(--color-accent);"><?php echo $business_phone; ?></a></p>
                    <a href="index.php" class="btn btn-vertex mt-4">Back to Home</a>
                </div>
            </div>
        </div>
    </section>

<?php include 'includes/footer.php'; ?>

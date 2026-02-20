<?php require_once __DIR__ . '/config.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? $page_title . ' | ' . $business_name : $business_name . ' | ' . $business_tagline; ?></title>
    <meta name="description" content="<?php echo isset($page_description) ? $page_description : $business_name . ' provides premium marquee and event hire in Limerick and across Ireland. Pagoda marquees for parties, weddings, and corporate events.'; ?>">

    <!-- Open Graph -->
    <meta property="og:title" content="<?php echo isset($page_title) ? $page_title . ' | ' . $business_name : $business_name; ?>">
    <meta property="og:description" content="<?php echo isset($page_description) ? $page_description : 'Premium marquee and event hire in Limerick, Ireland.'; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo $site_url; ?>">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="images/logo/favicon.ico">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet">

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
        <div class="container">
            <!-- Logo -->
            <a class="navbar-brand" href="index.php">
                <img src="images/logo/vertex-logo-white.png" alt="<?php echo $business_name; ?> Logo">
            </a>

            <!-- Mobile Toggle -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Nav Links -->
            <div class="collapse navbar-collapse" id="navbarMain">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($current_page === 'home') ? 'active' : ''; ?>" href="index.php">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($current_page === 'services') ? 'active' : ''; ?>" href="services.php">Services</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($current_page === 'gallery') ? 'active' : ''; ?>" href="gallery.php">Gallery</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($current_page === 'contact') ? 'active' : ''; ?>" href="contact.php">Contact</a>
                    </li>
                </ul>

                <!-- Social Icons -->
                <div class="social-icons d-flex align-items-center">
                    <?php if ($social_links['facebook'] !== '#'): ?>
                        <a href="<?php echo $social_links['facebook']; ?>" target="_blank" rel="noopener" aria-label="Facebook">
                            <i class="bi bi-facebook"></i>
                        </a>
                    <?php endif; ?>
                    <?php if ($social_links['instagram'] !== '#'): ?>
                        <a href="<?php echo $social_links['instagram']; ?>" target="_blank" rel="noopener" aria-label="Instagram">
                            <i class="bi bi-instagram"></i>
                        </a>
                    <?php endif; ?>
                    <?php if ($social_links['tiktok'] !== '#'): ?>
                        <a href="<?php echo $social_links['tiktok']; ?>" target="_blank" rel="noopener" aria-label="TikTok">
                            <i class="bi bi-tiktok"></i>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>

    <main>

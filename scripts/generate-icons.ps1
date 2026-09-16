Add-Type -AssemblyName System.Drawing

function Generate-AppIcon([int]$size, [string]$path) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Rounded background with gradient
    $bgRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $bgRect,
        [System.Drawing.Color]::FromArgb(255, 26, 26, 26),
        [System.Drawing.Color]::FromArgb(255, 10, 10, 10),
        45.0
    )
    $g.FillRectangle($bgBrush, $bgRect)

    # Subtle inner border
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 196, 167, 125), [Math]::Max(1.0, [float]($size * 0.01)))
    $g.DrawRectangle($borderPen, 2, 2, $size - 4, $size - 4)

    # Concentric rings
    $center = [float]($size / 2.0)
    $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 196, 167, 125), [Math]::Max(1.0, [float]($size * 0.006)))
    $ring1 = [float]($size * 0.38)
    $ring2 = [float]($size * 0.28)
    $g.DrawEllipse($ringPen, $center - $ring1, $center - $ring1, $ring1 * 2.0, $ring1 * 2.0)
    $g.DrawEllipse($ringPen, $center - $ring2, $center - $ring2, $ring2 * 2.0, $ring2 * 2.0)

    $goldRingPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 255, 215, 0), [Math]::Max(1.5, [float]($size * 0.008)))
    $ring3 = [float]($size * 0.18)
    $g.DrawEllipse($goldRingPen, $center - $ring3, $center - $ring3, $ring3 * 2.0, $ring3 * 2.0)

    # Bullseye center
    $bullBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 215, 0))
    $bRad = [float]($size * 0.045)
    $g.FillEllipse($bullBrush, $center - $bRad, $center - $bRad, $bRad * 2.0, $bRad * 2.0)

    # Traditional Bow Curve
    $bowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 196, 167, 125), [Math]::Max(2.5, [float]($size * 0.024)))
    $bx = [int]($size * 0.18)
    $by = [int]($size * 0.20)
    $bw = [int]($size * 0.44)
    $bh = [int]($size * 0.60)
    $bowRect = New-Object System.Drawing.Rectangle($bx, $by, $bw, $bh)
    $g.DrawArc($bowPen, $bowRect, [float]100.0, [float]160.0)

    # String line
    $stringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 245, 240, 232), 1.0)
    $stringPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $g.DrawLine($stringPen, [float]($size * 0.38), [float]($size * 0.23), [float]($size * 0.28), [float]($size * 0.77))

    # Flight Arrow shaft
    $arrowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 245, 240, 232), [Math]::Max(2.5, [float]($size * 0.02)))
    $g.DrawLine($arrowPen, [float]($size * 0.24), [float]($size * 0.76), [float]($size * 0.75), [float]($size * 0.25))

    # Arrow Head
    $tipX = [float]($size * 0.78)
    $tipY = [float]($size * 0.22)
    $hBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 215, 0))
    $p1 = New-Object System.Drawing.PointF($tipX, $tipY)
    $p2 = New-Object System.Drawing.PointF(([float]($tipX - ($size * 0.10))), ([float]($tipY + ($size * 0.02))))
    $p3 = New-Object System.Drawing.PointF(([float]($tipX - ($size * 0.02))), ([float]($tipY + ($size * 0.10))))
    $points = [System.Drawing.PointF[]]@($p1, $p2, $p3)
    $g.FillPolygon($hBrush, $points)

    # Feathers / Fletching
    $fletchPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 196, 167, 125), [Math]::Max(1.5, [float]($size * 0.012)))
    $g.DrawLine($fletchPen, [float]($size * 0.26), [float]($size * 0.74), [float]($size * 0.20), [float]($size * 0.80))
    $g.DrawLine($fletchPen, [float]($size * 0.30), [float]($size * 0.70), [float]($size * 0.24), [float]($size * 0.76))
    $g.DrawLine($fletchPen, [float]($size * 0.26), [float]($size * 0.74), [float]($size * 0.31), [float]($size * 0.81))
    $g.DrawLine($fletchPen, [float]($size * 0.30), [float]($size * 0.70), [float]($size * 0.35), [float]($size * 0.77))

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $path ($size x $size)"
}

$destDir = "c:\xampp\htdocs\archerlog\public\icons"
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir | Out-Null
}

Generate-AppIcon 192 "$destDir\icon-192.png"
Generate-AppIcon 512 "$destDir\icon-512.png"
Generate-AppIcon 180 "$destDir\apple-touch-icon.png"

import math
from app.constants import SPEED_OF_LIGHT, MIN_FSPL_DB, MAX_FSPL_DB
import logging

logger = logging.getLogger(__name__)

def calculate_transmission(tx_power_w: float, distance_m: float, frequency_hz: float, tx_diameter_m: float, rx_diameter_m: float, eta_aperture: float = 0.6):
    """
    Calculate RF transmission link budget using Friis equation.
    λ = c / f
    FSPL = (4πd / λ)²
    """
    logger.info(f"Calculating transmission with: tx_power_w={tx_power_w}, distance_m={distance_m}, frequency_hz={frequency_hz}, tx_diameter_m={tx_diameter_m}, rx_diameter_m={rx_diameter_m}, eta_aperture={eta_aperture}")

    assert distance_m > 0, "Distance must be > 0"
    assert frequency_hz > 0, "Frequency must be > 0"

    # Wavelength
    lam = SPEED_OF_LIGHT / frequency_hz
    logger.info(f"Wavelength (lam): {lam}")
    
    # Linear FSPL
    fspl_linear = (4 * math.pi * distance_m / lam) ** 2
    logger.info(f"FSPL (linear): {fspl_linear}")
    
    # dB conversions
    fspl_db = 10 * math.log10(fspl_linear)
    logger.info(f"FSPL (dB): {fspl_db}")
    
    # Calculate Linear Gain G = eta * (pi * D / lam)^2
    gt_linear = eta_aperture * ((math.pi * tx_diameter_m) / lam) ** 2
    gr_linear = eta_aperture * ((math.pi * rx_diameter_m) / lam) ** 2
    logger.info(f"Gain tx (linear): {gt_linear}, Gain rx (linear): {gr_linear}")
    
    # Calculate dB Gain
    tx_gain_db = 10 * math.log10(gt_linear)
    rx_gain_db = 10 * math.log10(gr_linear)
    logger.info(f"Gain tx (dB): {tx_gain_db}, Gain rx (dB): {rx_gain_db}")

    # Assert physical realism for space links
    assert MIN_FSPL_DB <= fspl_db <= MAX_FSPL_DB, f"FSPL ({fspl_db:.2f} dB) out of physically plausible bounds ({MIN_FSPL_DB}-{MAX_FSPL_DB} dB)"
    
    tx_power_dbw = 10 * math.log10(tx_power_w) if tx_power_w > 0 else -999.0
    logger.info(f"TX power (dBW): {tx_power_dbw}")
    
    # We assume an overall atmospheric + pointing loss default
    losses_db = 2.0
    
    # Rx Power in dBW
    # Pr = Pt + Gt + Gr - FSPL - losses
    rx_power_dbw = tx_power_dbw + tx_gain_db + rx_gain_db - fspl_db - losses_db
    logger.info(f"RX power (dBW): {rx_power_dbw}")
    
    # Rx Power in linear Watts
    rx_power_w = 10 ** (rx_power_dbw / 10)
    logger.info(f"RX power (W): {rx_power_w}")
    
    # Overall transmission efficiency
    transmission_efficiency = rx_power_w / tx_power_w if tx_power_w > 0 else 0
    logger.info(f"Transmission efficiency: {transmission_efficiency}")
    assert 0 <= transmission_efficiency <= 1, "Transmission efficiency must be between 0 and 1"

    trace = [
        "λ = c / f",
        f"λ = {SPEED_OF_LIGHT} m/s / {frequency_hz:e} Hz = {lam:.4f} m",
        "G = η × (πD / λ)² [Aperture Antenna Model]",
        f"Gt_linear = {eta_aperture} × (π × {tx_diameter_m} / {lam:.4f})² = {gt_linear:.2e}",
        f"Gr_linear = {eta_aperture} × (π × {rx_diameter_m} / {lam:.4f})² = {gr_linear:.2e}",
        "G_dB = 10*log10(G)",
        f"Gt_dB = {tx_gain_db:.2f} dB, Gr_dB = {rx_gain_db:.2f} dB",
        "FSPL_linear = (4πd / λ)²",
        f"FSPL_linear = (4π × {distance_m} / {lam:.4f})² = {fspl_linear:e}",
        "FSPL(dB) = 10*log10(FSPL_linear)",
        f"FSPL(dB) = {fspl_db:.2f} dB",
        "Pr(dBW) = Pt(dBW) + Gt + Gr - FSPL - losses",
        f"Pr(dBW) = {tx_power_dbw:.2f} + {tx_gain_db:.2f} + {rx_gain_db:.2f} - {fspl_db:.2f} - {losses_db}",
        f"Pr(dBW) = {rx_power_dbw:.2f} dBW",
        f"P_received(W) = {rx_power_w:.2e} W"
    ]
    
    # Return everything needed for the link budget table and further computation
    return {
        "tx_power_dbw": tx_power_dbw,
        "tx_gain_db": tx_gain_db,
        "rx_gain_db": rx_gain_db,
        "fspl_db": fspl_db,
        "losses_db": losses_db,
        "rx_power_dbw": rx_power_dbw,
        "rx_power_w": rx_power_w,
        "efficiency": transmission_efficiency,
        "trace": trace
    }

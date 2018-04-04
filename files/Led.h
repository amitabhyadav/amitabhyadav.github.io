#ifndef __Led_h
#define __Led_h

/*
 * Led interface
 *
 * JL, 22-12-2010
 */

#include <io.h>
#include <iomacros.h>

#define RED    (uint8_t) 0x10
#define GREEN  (uint8_t) 0x20
#define BLUE   (uint8_t) 0x20
#define YELLOW (uint8_t) 0x40

#define ON  (uint8_t) 1
#define OFF (uint8_t) 0

void InitLeds   (uint8_t Colors);
void SetLeds    (uint8_t Colors, uint8_t On);
void ToggleLeds (uint8_t Colors);

#endif

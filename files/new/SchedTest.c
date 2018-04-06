/*
 * This file is controlled by constants
 * 
 * For link against:
 *   a scheduler with threads:   #define THREADS 
 *   a non-preemptive scheduler: #define NONPRE
 *   the simplest non-preemtpive scheduler: 
 *                               #define NONPREBASIC
 *
 * If semaphores have been defined:
 *                               #define SEMA
 * If an UART has been added:    #define UART
 */

//#define NONPRE
//#define THREADS
//#define SEMA

#include "Led.h"
#include "Clock.h"
#include "Scheduler.h"
#ifdef UART
#include "Uart.h"
#endif
#ifdef SEMA
#include "Semaphore.h"
#endif

#define BLINKERA  2
#define BLINKERB  1
#define BLINKERC  0

#define YELLOWBLINKPRIO 5
#define REDBLINKPRIO    4
#define GREENBLINKPRIO  3

#define UARTCHAR 6

void BlinkYellow (void)
{
  ToggleLeds (YELLOW);
}

void BlinkRed (void)
{
  ToggleLeds (RED);
}

void CountDelay (volatile uint16_t cnt)
{
  while (cnt--);
}

void BlinkGreen (void)
{
  static int i = 0;
  if (++i % 4 == 0) {
    CountDelay (60000); 

    /* An event-triggered extension
    Activate (REDBLINKPRIO, TicksPS/2);
    */
    Activate (REDBLINKPRIO, TicksPS/2);
  }    
  ToggleLeds (GREEN);
}


/* Some Thread-based test routines
 */

#ifdef SEMA

Sem s, t;

void Delay (uint16_t Ticks)
{
  Activate (CurrentPrio(), Ticks); Suspend ();
}

void BlinkerD (void)
{
  Delay (TicksPS*3);
  while (1) {
    SetLeds (RED, ON);
    SemPost (&s);
    SemWait (&t, 0);
    SetLeds (RED, OFF);
    Delay (TicksPS);
  }
}

void BlinkerE (void)
{
  while (1) {
    ToggleLeds (YELLOW);
    if (SemWait (&s, 0) == E_SEMFAIL) ToggleLeds (RED);
    Delay (TicksPS);
    SemPost (&t);
  }
}
#endif

int main(void) 
{ 
  WDTCTL = WDTPW + WDTHOLD;       // Stop watchdog timer 
  
  InitTasks (); InitClock ();
  InitLeds (RED | GREEN | YELLOW);
#ifdef UART
  InitUart ();
#endif

#define Tst1

#ifdef Tst1
  RegisterTask (0, 1024, BlinkYellow, YELLOWBLINKPRIO, 0);
  RegisterTask (0, 512, BlinkGreen, GREENBLINKPRIO, 0);
  RegisterTask (0, 0, BlinkRed, REDBLINKPRIO, 0);
#endif
#ifdef Tst2
  RegisterTask (0, TicksPS, SendChar, UARTCHAR, TT);
#endif
#ifdef Tst3
  InitSem (&s, 0);
  InitSem (&t, 0);
  RegisterTask (0, 0, BlinkerD, BLINKERA, THREAD|TT);
  RegisterTask (0, 0, BlinkerE, BLINKERB, THREAD|TT);
#endif

  _EINT();                        // Enable interrupts

#ifdef NONPRE
  while (1) { 
    HandleTasks();                // Beware, a race condition
    EnterLowPowerMode3();         // idle task, set to low power mode 3 
   }                              // (Aclock still working)
#else
  while (1) EnterLowPowerMode3(); // idle task, set to low power mode 3 
#endif                            // (Aclock still working)

  return (0);
}